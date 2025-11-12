import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { API } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { isOnlyDateEqual, removeLastZchar } from "../../utils/functions";
import type { NotificationDetailed } from "../../types/types";
import NotificationCard from "./NotificationCard";
import { usePusher } from "../../contexts/PusherContext";
import InlineSpinner from "../Spinners/InlineSpinner";
import { useTaskModal } from "../../contexts/TaskModalContext";

function NotificationPopup({ isOpen, onCloseCallback, ignoreRef }: { isOpen: boolean, onCloseCallback: () => void, ignoreRef: RefObject<HTMLElement | null> }) {
    // useOutsideClick(popupRef, onCloseCallback, ignoreRef);

    const popupRef = useRef<HTMLDivElement | null>(null);
    const pusher = usePusher();
    const { user } = useAuth();
    const { isTaskModalOpen } = useTaskModal();

    const [isLoading, setIsLoading] = useState(false);
    const [todayNotifications, setTodayNotifications] = useState<NotificationDetailed[]>([]);
    const [earlierNotifications, setEarlierNotifications] = useState<NotificationDetailed[]>([]);
    const [page, setPage] = useState(1);
    const [hasMorePage, setHasMorePage] = useState(true);
    const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(false);

    const observer = useRef<IntersectionObserver | null>(null);

    const loaderRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasMorePage && isInfiniteScrollEnabled) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, hasMorePage, isInfiniteScrollEnabled]);

    // initial popup load + clean up
    useEffect(() => {
        if (isOpen) {
            fetchData();
        }

        return (() => {
            setPage(1);
            setHasMorePage(true);
            setIsInfiniteScrollEnabled(false);
            setTodayNotifications([]);
            setEarlierNotifications([]);
        });
    }, [isOpen])

    // infinite noti scroll
    useEffect(() => {
        if (page === 1) return;
        fetchMoreNotis();
    }, [page]);

    useEffect(() => {
        if (!pusher || !user || !isOpen) {
            return;
        }

        const private_user_channel = pusher.channel("private-user-" + user.userID);
        private_user_channel.bind("private-user-notiCard-event", function(data: unknown) {
            setTodayNotifications(prev => {
                return [{
                    ...data,
                    createdAt: data.createdAt === null ? null : new Date(removeLastZchar(data.createdAt)), // super low iq fix for UTC timestamp sent from db
                }, ...prev]
            });
        });

        return () => {
            private_user_channel.unbind("private-user-notiCard-event");
        }
    }, [pusher, user, isOpen])


    // clicking outside popup
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;

            if (isTaskModalOpen) {
                return;
            }

            if (ignoreRef && ignoreRef.current && ignoreRef.current.contains(target)) {
                return;
            }

            if (popupRef && popupRef.current && !popupRef.current.contains(target)) {
                onCloseCallback();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleClick);
        }
    }, [popupRef, onCloseCallback, ignoreRef, isOpen, isTaskModalOpen])


    async function fetchData() {
        setIsLoading(true);
        const data = await API.getUserNotis(user!.userID);
        // TODO: check no notification

        let today = [];
        let earlier = [];
        const NOW = new Date(Date.now());
        for (let row of data) {
            if (isOnlyDateEqual(row.createdAt, NOW)) {
                today.push(row);
            } else {
                earlier.push(row);
            }
        }

        setTodayNotifications(today);
        setEarlierNotifications(earlier);

        if (earlier.length < 10) { // 10 = PAGE_SIZE
            setHasMorePage(false);
        }

        setIsLoading(false);
    }

    async function fetchMoreNotis() {
        setIsLoading(true);
        try {
            const data = await API.getUserEarlierNotis(user!.userID, page);
            setEarlierNotifications(prevNotis => {
                // const newPosts = data.posts.filter(p => !prevPosts.some(op => op.id === p.id)); ignore check duplicates for now
                return [...prevNotis, ...data.notifications];
            });
            setHasMorePage(data.hasMorePage);
        } catch (err) {
            // TODO: better alert error
            console.error("" + err);
        } finally {
            setIsLoading(false);
        }
    }

    function enableInfiniteScroll() {
        setIsInfiniteScrollEnabled(true);
        setPage(2);
    }

    if (!isOpen) return null;

    if (isLoading && !isInfiniteScrollEnabled) {
        return (
            <>
                <div
                    ref={popupRef}
                    className="fixed top-17 right-6 w-120 min-h-[20vh] max-h-[90vh] z-50 p-3 bg-gray-100 border border-gray-200 rounded-md shadow-lg overflow-y-auto flex justify-center items-center"
                >
                    <InlineSpinner />
                </div>
            </>
        );
    }

    if (todayNotifications.length === 0 && earlierNotifications.length === 0) {
        return (
            <>
                <div
                    ref={popupRef}
                    className="fixed top-17 right-6 w-120 min-h-[20vh] max-h-[90vh] z-50 p-3 bg-gray-100 border border-gray-200 rounded-md shadow-lg overflow-y-auto flex justify-center items-center"
                >
                    <div className="w-full flex justify-center items-center italic text-gray-500 mt-4">
                        {"คุณไม่มีการแจ้งเตือนอะไรเลย 👁️👄👁️"}
                    </div>
                </div>
            </>
        );
    }

    return createPortal
        (
            <>
                <div
                    ref={popupRef}
                    className="fixed top-17 right-6 w-120 min-h-[20vh] max-h-[90vh] z-50 p-3 bg-gray-100 border border-gray-200 rounded-md shadow-lg overflow-y-auto"
                >

                    {todayNotifications.length > 0 && <div className="mt-3 mb-3 text-2xl font-bold">วันนี้</div>}
                    {
                        todayNotifications.map(x => {
                            return (
                                <NotificationCard key={x.notificationID} visited={x.visited} senderName={x.senderName} senderTeamName={x.senderTeamName} message={x.message} createdAt={x.createdAt} notiID={x.notificationID} linkTargetID={x.linkTargetID} notificationTypeID={x.notificationTypeID} />
                            );
                        })
                    }

                    {earlierNotifications.length > 0 && <div className="mt-3 mb-3 text-2xl font-bold">ก่อนหน้านี้</div>}
                    {
                        earlierNotifications.map(x => {
                            return (
                                <NotificationCard key={x.notificationID} visited={x.visited} senderName={x.senderName} senderTeamName={x.senderTeamName} message={x.message} createdAt={x.createdAt} notiID={x.notificationID} linkTargetID={x.linkTargetID} notificationTypeID={x.notificationTypeID} />
                            );
                        })
                    }

                    <div
                        id="observer"
                        ref={loaderRef}
                        className={isInfiniteScrollEnabled ? 'h-1 w-full' : 'hidden'}
                    />

                    {isInfiniteScrollEnabled && isLoading && <InlineSpinner />}

                    {
                        earlierNotifications.length > 0 && hasMorePage && !isInfiniteScrollEnabled &&
                        <button
                            onClick={enableInfiniteScroll}
                            className="bg-orange-500 text-white text-sm p-3 shadow-sm w-full mt-3 mb-3 rounded-md hover:bg-orange-600 transition-color"
                        >
                            ดูการแจ้งเตือนที่ผ่านมา
                        </button>
                    }

                    {!hasMorePage &&
                        <div className="text-center text-gray-500 py-4 italic">
                            หมดแล้วแจ้ 🖐️😛🤚
                        </div>
                    }
                </div >
            </>
            , document.getElementById("noti-popup-root")!
        );
}

export default NotificationPopup;
