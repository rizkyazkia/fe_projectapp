import React from "react";
import { HSStaticMethods } from "preline/preline";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useAuth } from "../../hooks/auth/useAuth";
import useSWR from "swr";
import { jwtDecode } from "jwt-decode";
import { token } from "../../lib/auth/authAPI";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../../lib/notificationAPI";

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};

const Header = () => {
  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);

  const { logout, user, accessToken, setAccessToken, setUser } = useAuth();

  const getActiveToken = async () => {
    const currentTime = new Date().getTime();
    if (user?.exp * 1000 < currentTime) {
      const response = await token();
      setAccessToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUser(decoded);
      return response.data.accessToken;
    }
    return accessToken;
  };

  const fetchUnreadCount = async () => {
    const t = await getActiveToken();
    const res = await getUnreadCount(t);
    return res.data.count;
  };

  const fetchNotifications = async () => {
    const t = await getActiveToken();
    const res = await getNotifications(t);
    return res.data.notifications;
  };

  const { data: unreadCount = 0, mutate: mutateCount } = useSWR(
    "unreadNotificationCount",
    fetchUnreadCount,
    { refreshInterval: 30000 }
  );

  const { data: notifications = [], mutate: mutateNotif } = useSWR(
    "notifications",
    fetchNotifications,
    { refreshInterval: 30000 }
  );

  const handleMarkAllRead = async () => {
    try {
      const t = await getActiveToken();
      await markAllAsRead(t);
      mutateCount();
      mutateNotif();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const t = await getActiveToken();
      await markAsRead(id, t);
      mutateCount();
      mutateNotif();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-48 w-full bg-white border-b border-obito-grey text-sm py-2.5 lg:ps-65 shadow-sm">
      <nav className="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
        <div className="me-5 lg:me-0 lg:hidden">
          <a
            className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
            href="/"
            aria-label="Preline"
          >
            <svg
              className="w-28 h-auto"
              width="116"
              height="32"
              viewBox="0 0 116 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M33.5696 30.8182V11.3182H37.4474V13.7003H37.6229C37.7952 13.3187 38.0445 12.9309 38.3707 12.5369C38.7031 12.1368 39.134 11.8045 39.6634 11.5398C40.1989 11.2689 40.8636 11.1335 41.6577 11.1335C42.6918 11.1335 43.6458 11.4044 44.5199 11.946C45.3939 12.4815 46.0926 13.291 46.6158 14.3743C47.139 15.4515 47.4006 16.8026 47.4006 18.4276C47.4006 20.0095 47.1451 21.3452 46.6342 22.4347C46.1295 23.518 45.4401 24.3397 44.5661 24.8999C43.6982 25.4538 42.7256 25.7308 41.6484 25.7308C40.8852 25.7308 40.2358 25.6046 39.7003 25.3523C39.1709 25.0999 38.737 24.7829 38.3984 24.4013C38.0599 24.0135 37.8014 23.6226 37.6229 23.2287H37.5028V30.8182H33.5696ZM37.4197 18.4091C37.4197 19.2524 37.5367 19.9879 37.7706 20.6158C38.0045 21.2436 38.343 21.733 38.7862 22.0838C39.2294 22.4285 39.768 22.6009 40.402 22.6009C41.0421 22.6009 41.5838 22.4254 42.027 22.0746C42.4702 21.7176 42.8056 21.2251 43.0334 20.5973C43.2673 19.9633 43.3842 19.2339 43.3842 18.4091C43.3842 17.5904 43.2704 16.8703 43.0426 16.2486C42.8149 15.6269 42.4794 15.1406 42.0362 14.7898C41.593 14.4389 41.0483 14.2635 40.402 14.2635C39.7618 14.2635 39.2202 14.4328 38.777 14.7713C38.34 15.1098 38.0045 15.59 37.7706 16.2116C37.5367 16.8333 37.4197 17.5658 37.4197 18.4091ZM49.2427 25.5V11.3182H53.0559V13.7926H53.2037C53.4622 12.9124 53.8961 12.2476 54.5055 11.7983C55.1149 11.3428 55.8166 11.1151 56.6106 11.1151C56.8076 11.1151 57.02 11.1274 57.2477 11.152C57.4754 11.1766 57.6755 11.2105 57.8478 11.2536V14.7436C57.6632 14.6882 57.4077 14.639 57.0815 14.5959C56.7553 14.5528 56.4567 14.5312 56.1859 14.5312C55.6073 14.5312 55.0903 14.6574 54.6348 14.9098C54.1854 15.156 53.8284 15.5007 53.5638 15.9439C53.3052 16.3871 53.176 16.898 53.176 17.4766V25.5H49.2427ZM64.9043 25.777C63.4455 25.777 62.1898 25.4815 61.1373 24.8906C60.0909 24.2936 59.2845 23.4503 58.7182 22.3608C58.1519 21.2652 57.8688 19.9695 57.8688 18.4737C57.8688 17.0149 58.1519 15.7346 58.7182 14.6328C59.2845 13.531 60.0816 12.6723 61.1096 12.0568C62.1437 11.4476 63.3755 11.1469 64.7952 11.1469C66.2026 11.1469 67.403 11.4476 68.3964 12.0491C69.3898 12.6444 70.1501 13.4622 70.6774 14.5025C71.2048 15.5427 71.4685 16.7279 71.4685 18.0583C71.4685 19.3825 71.2016 20.5677 70.668 21.614C70.1406 22.6543 69.3772 23.475 68.3777 24.0765C67.3843 24.6717 66.187 24.9694 64.7858 24.9694C63.3912 24.9694 62.1945 24.6486 61.1957 24.0072C60.2029 23.3658 59.4423 22.506 58.9143 21.4276L62.1996 19.6406C62.5013 20.181 62.8583 20.5898 63.2707 20.867C63.6892 21.1442 64.1694 21.2828 64.711 21.2828C65.2465 21.2828 65.6897 21.1351 66.0405 20.8397C66.3975 20.5381 66.6684 20.117 66.853 19.5765C67.0438 19.036 67.1392 18.4012 67.1392 17.6723C67.1392 16.9507 67.0438 16.3228 66.853 15.7885C66.6684 15.248 66.3975 14.8301 66.0405 14.5346C65.6836 14.2392 65.2404 14.0915 64.711 14.0915C64.0882 14.0915 63.5767 14.264 63.1765 14.6089C62.7763 14.9477 62.4809 15.4055 62.2901 15.9823L58.8953 14.4392C59.372 13.1832 60.0848 12.2231 61.0339 11.5588C61.9829 10.8884 63.1115 10.5532 64.4197 10.5532C65.7721 10.5532 66.9511 10.8201 67.9568 11.3539C68.9625 11.8816 69.7356 12.6274 70.2759 13.5914C70.8224 14.5493 71.0956 15.6601 71.0956 16.9239C71.0956 18.6886 70.5678 20.1439 69.5122 21.29C68.4628 22.4298 67.0901 23.0007 65.3942 23.0028C63.8884 23.0049 62.6059 22.6096 61.5469 21.8173C60.4879 21.0247 59.7092 19.9819 59.2106 18.6886C58.7121 17.3954 58.4628 15.8966 58.4628 14.1922C58.4628 13.0808 58.5819 12.0531 58.8201 11.1091C59.0645 10.1652 59.4423 9.34244 59.9536 8.64106C60.471 7.93967 61.1349 7.4083 61.9454 7.04694C62.7559 6.67942 63.7284 6.49566 64.863 6.49566C66.1307 6.49566 67.2321 6.74559 68.1673 7.24547C69.1024 7.73919 69.8271 8.42964 70.3413 9.31684L67.313 11.2784C66.939 10.5972 66.437 10.0766 65.8072 9.7167C65.1775 9.35057 64.4781 9.1675 63.7088 9.1675C63.1487 9.1675 62.6869 9.27076 62.3234 9.47729C61.966 9.68382 61.6951 9.96233 61.5104 10.3128C61.3258 10.6633 61.2068 11.0586 61.1533 11.4988C61.106 11.9328 61.1001 12.3862 61.1356 12.8589H64.4197V16.1197H58.3129V12.954H61.9087V12.0628C61.9087 11.5579 61.9454 11.1039 62.0189 10.7007H58.4628V7.77375H64.9774V10.866C65.6383 10.5615 66.3353 10.3447 67.0684 10.2155C67.8076 10.0801 68.5582 10.0124 69.3201 10.0124C71.1726 10.0124 72.6809 10.4351 73.8448 11.2805C75.0088 12.1259 75.5908 13.3657 75.5908 14.9998C75.5908 16.5832 75.0749 17.925 74.0431 19.0252C73.0175 20.1193 71.7537 20.6663 70.2516 20.6663Z"
                className="fill-blue-600"
                fill="currentColor"
              />
              <path
                d="M1 29.5V16.5C1 9.87258 6.37258 4.5 13 4.5C19.6274 4.5 25 9.87258 25 16.5C25 23.1274 19.6274 28.5 13 28.5H12"
                className="stroke-blue-600"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M5 29.5V16.66C5 12.1534 8.58172 8.5 13 8.5C17.4183 8.5 21 12.1534 21 16.66C21 21.1666 17.4183 24.82 13 24.82H12"
                className="stroke-blue-600"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="13"
                cy="16.5214"
                r="5"
                className="fill-blue-600"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>

        <div className="w-full flex items-center justify-end ms-auto">
          <div className="flex flex-row items-center justify-end gap-2">
            {/* Notifikasi Bell */}
            <div className="hs-dropdown relative inline-flex">
              <button
                type="button"
                className="relative size-9.5 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-600 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Notifikasi"
              >
                <MdOutlineNotificationsActive size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-80 bg-white shadow-md rounded-lg mt-2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-dropdown-custom-trigger"
              >
                <div className="py-3 px-5 bg-gray-100 rounded-t-lg flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Notifikasi {unreadCount > 0 && `(${unreadCount})`}
                  </p>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      onClick={handleMarkAllRead}
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-5 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notif.isRead ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {formatTime(notif.createdAt)}
                            </p>
                          </div>
                          {!notif.isRead && (
                            <span className="size-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-sm text-gray-400">
                      <svg
                        className="size-10 mx-auto mb-3 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
                        />
                      </svg>
                      <p>Belum ada notifikasi</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* End Notifikasi */}

            {/* Dropdown Profil */}
            <div className="hs-dropdown relative inline-flex">
              <button
                id="hs-dropdown-custom-trigger"
                type="button"
                className="hs-dropdown-toggle py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Dropdown"
              >
                <img
                  className="w-8 h-auto rounded-full"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                  alt="Avatar"
                />
                <span className="text-gray-600 font-medium truncate max-w-30">
                  {user?.username}
                </span>
                <svg
                  className="hs-dropdown-open:rotate-180 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-dropdown-custom-trigger"
              >
                <div className="py-3 px-5 bg-gray-100 rounded-t-lg">
                  <p className="text-sm text-gray-500">Masuk sebagai</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email}
                  </p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <div
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-900 hover:bg-red-100 hover:text-red-500 focus:outline-hidden focus:bg-gray-100 cursor-pointer"
                    onClick={() => logout()}
                  >
                    <RiLogoutCircleRLine size={16} />
                    Keluar
                  </div>
                </div>
              </div>
            </div>
            {/* End Dropdown Profil */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
