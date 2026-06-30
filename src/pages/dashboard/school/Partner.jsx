import React from "react";
import TablePartner from "../../../components/dashboard/school/TablePartner";
import { addPartners, deletePartner } from "../../../lib/school/partnerAPI";
import { getHealthCares } from "../../../lib/healthcare/healthcareAPI";
import { HSStaticMethods, HSOverlay } from "preline/preline";
import { useAuth } from "../../../hooks/auth/useAuth";
import { token } from "../../../lib/auth/authAPI";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { mutate } from "swr";

const Partner = () => {
  const { setAccessToken, user, setUser, accessToken } = useAuth();

  const [dataPartner, setDataPartner] = React.useState(null);
  const [healthCares, setHealthCares] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const selectRef = React.useRef(null);

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

  const revalidatePartners = () => {
    mutate((key) => Array.isArray(key) && key[0] === "partners", undefined, {
      revalidate: true,
    });
  };

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await getHealthCares();
        console.log("Fetched healthCares:", response.data);
        setHealthCares(response.data || []);
      } catch (err) {
        console.log({ err });
        setHealthCares([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    console.log("healthCares state:", healthCares);
    if (healthCares.length > 0) {
      setTimeout(() => {
        console.log("Calling HSStaticMethods.autoInit...");
        HSStaticMethods.autoInit();
      }, 50);
    }
  }, [healthCares]);

  // Cleanup Preline instance before React unmount (fix HMR removeChild error)
  React.useEffect(() => {
    return () => {
      if (selectRef.current) {
        // Destroy Preline hs-select instance
        if (selectRef.current._hsSelect) {
          try {
            selectRef.current._hsSelect.destroy();
          } catch (_) {}
          delete selectRef.current._hsSelect;
        }
        // Gabungan: window.HSSelect available di beberapa versi Preline
        try {
          const instances = window.HSSelect?.getInstance(selectRef.current);
          if (instances?.destroy) instances.destroy();
        } catch (_) {}
      }
    };
  }, []);

  const addMitra = async () => {
    if (selectedIds.length === 0) {
      toast.warning("Pilih minimal satu mitra");
      return;
    }

    const activeToken = await getActiveToken();
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => addPartners(activeToken, selectedIds)),
      {
        pending: "Menambahkan mitra...",
        success: {
          render() {
            return "Mitra berhasil ditambahkan";
          },
          onClose: () => {
            HSOverlay.close("#modal-add-partners");
            setSelectedIds([]);
            revalidatePartners();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
        },
      },
    );
  };

  const handleDelete = async (id) => {
    const activeToken = await getActiveToken();
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const handleLoading = delay(1000);

    toast.promise(
      handleLoading.then(() => deletePartner(activeToken, id)),
      {
        pending: "Menghapus mitra...",
        success: {
          render() {
            return "Mitra berhasil dihapus";
          },
          onClose: () => {
            revalidatePartners();
          },
        },
        error: {
          render(response) {
            return response.data.message;
          },
        },
      },
    );
  };

  return (
    <div>
      <TablePartner handleDelete={handleDelete} setDataPartner={setDataPartner}>
        <div className="py-3 px-4">
          {loading ? (
            <p className="text-sm text-gray-500">Memuat data faskes...</p>
          ) : !healthCares.length ? (
            <p className="text-sm text-gray-500">
              Tidak ada data faskes tersedia
            </p>
          ) : (
            <select
              ref={selectRef}
              key={healthCares.length}
              id="hs-tags"
              multiple
              data-hs-select='{
                  "placeholder": "Cari dan pilih faskes...",
                  "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                  "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                  "mode": "tags",
                  "wrapperClasses": "relative ps-0.5 pe-9 min-h-11.5 flex items-center flex-wrap text-nowrap w-full bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-700 focus:ring-blue-700",
                  "tagsItemTemplate": "<div class=\"flex flex-nowrap items-center relative z-10 bg-white border border-gray-200 rounded-full p-1 m-1\"><div class=\"whitespace-nowrap text-gray-800\" data-title></div><div class=\"inline-flex shrink-0 justify-center items-center size-5 ms-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 text-sm cursor-pointer\" data-remove><svg class=\"shrink-0 size-3\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/></svg></div></div>",
                  "tagsInputId": "hs-tags-input",
                  "tagsInputClasses": "py-2.5 sm:py-3 px-2 min-w-20 rounded-lg order-1 bg-transparent border-transparent text-gray-800 placeholder:text-gray-500 focus:ring-0 sm:text-sm outline-hidden",
                  "optionTemplate": "<div><div class=\"text-sm font-semibold text-gray-800\" data-title></div><div class=\"text-xs text-gray-500\" data-description></div></div>",
                  "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                }'
              className="hidden"
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(
                  (opt) => Number(opt.value),
                );
                console.log("selected values:", selected);
                setSelectedIds(selected);
              }}
            >
              <option value="">Pilih faskes</option>
              {healthCares.map((hc) => (
                <option
                  key={hc.id}
                  value={hc.id}
                  data-hs-select-option={`{"description": "${hc.city?.name || ""}"}`}
                >
                  {hc.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="w-full h-[1px] bg-gray-200"></div>
        <div className="flex justify-end my-4 mr-4">
          <button
            type="button"
            onClick={addMitra}
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-800 text-white hover:bg-blue-900 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            disabled={selectedIds.length === 0}
          >
            Simpan
          </button>
        </div>
      </TablePartner>
    </div>
  );
};

export default Partner;
