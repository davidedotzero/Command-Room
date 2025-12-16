#command-room
frontend.
react + ts w/ vite

vercel host
    - client @command-room.vercel.app
    - server @command-room-backend.vercel.app
        express.js
        passport.js jwt authentication + google social 0Auth
        pusher.js

hostatom
    - mysql db

pusher
    - pusher channel for real-time notifications

###

TaskModalContext is for spawning TaskDetailModal anywhere from clicking notification card.

EditTaskModal is spaghetti asf, susu kub :thumbs_up:

we are using LegacyCreateTaskModal, the CreateTaskModal will be used for future "Task to Task" feature.

useDatePickerFix is a hook for fixing react-datetimepicker styling quirks that works half of the time xdddd.
useRefreshSignalStore is a global hook; use its refreshKey property in useEffect dependencies for triggering it programatically. Used in triggering parent page's rerender after updating TaskDetailModal that spawned from notifications.

