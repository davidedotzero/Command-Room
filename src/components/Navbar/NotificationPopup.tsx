import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { API } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { formatDateYYYY_MM_DD_HH_MM_SS, isOnlyDateEqual } from "../../utils/functions";
import AssigneeLabels from "../miscs/AssigneeLabels";
import TeamLabel from "../miscs/TeamLabels";
import type { NotificationDetailed } from "../../types/types";
import NotificationCard from "./NotificationCard";

function NotificationPopup({ isOpen, onCloseCallback, ignoreRef }: { isOpen: boolean, onCloseCallback: () => void, ignoreRef: RefObject<HTMLElement | null> }) {
    // useOutsideClick(popupRef, onCloseCallback, ignoreRef);

    const popupRef = useRef<HTMLDivElement | null>(null);
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [todayNotifications, setTodayNotifications] = useState<NotificationDetailed[]>([]);
    const [earlierNotifications, setEarlierNotifications] = useState<NotificationDetailed[]>([]);
    const [page, setPage] = useState(1);
    const [hasMorePage, setHasMorePage] = useState(true);

    const observer = useRef<IntersectionObserver | null>(null);

    const loaderRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasMorePage) {
                console.log("juan");
                setPage(prevPage => prevPage += 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, hasMorePage]);

    // initial popup load
    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen])

    // infinite noti scroll
    useEffect(() => {
        if (page === 1) return;
        fetchMoreNotis();
    }, [page]);

    // clicking outside popup
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
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
    }, [popupRef, onCloseCallback, ignoreRef, isOpen])


    async function fetchData() {
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
        // setNotifications(data);
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

    if (!isOpen) return null;
    return createPortal
        (
            <>
                <div
                    ref={popupRef}
                    className="fixed top-17 right-6 w-120 min-h-[20vh] max-h-[90vh] z-50 p-3 bg-gray-100 border border-gray-200 rounded-md shadow-lg overflow-y-auto"
                >
                    <div className="mt-3 mb-3 text-2xl font-bold">วันนี้</div>
                    {
                        todayNotifications.map(x => {
                            return (
                                <NotificationCard visited={x.visited} senderName={x.senderName} senderTeamName={x.senderTeamName} message={x.message} createdAt={x.createdAt} />
                            );
                        })
                    }
                    <div className="mt-3 mb-3 text-2xl font-bold">ก่อนหน้านี้</div>
                    {
                        earlierNotifications.map(x => {
                            return (
                                <NotificationCard visited={x.visited} senderName={x.senderName} senderTeamName={x.senderTeamName} message={x.message} createdAt={x.createdAt} />
                            );
                        })
                    }

                    <div id="observer" ref={loaderRef}></div>
                    <button className="bg-orange-500 text-white text-sm p-3 shadow-sm w-full mt-3 mb-3 rounded-md hover:bg-orange-600 transition-color">
                        ดูการแจ้งเตือนที่ผ่านมา
                    </button>
                </div>
            </>
            , document.getElementById("noti-popup-root")!
        );
}

/*
[ชื่อuser] กำลัง/ได้ทำการ [ชื่อโปรเจกต์ ]
อัพเดท/สร้างใหม่[ชื่อTask]
วันที่อัพเดท
*/

export default NotificationPopup;
