import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { 
    BiArrowBack, 
    BiCamera, 
    BiImage, 
    BiBattery, 
    BiChip, 
    BiInfoCircle, 
    BiCheckCircle, 
    BiXCircle, 
    BiShoppingBag,
    BiTime,
    BiShield,
    BiMobile
} from "react-icons/bi";
import { toast } from "react-hot-toast";

// Hooks
import useDetailProduct from "../hooks/useDetailProduct";
import useUser from "../../auth/Hooks/useUser";
import useOrderSet from "../../order/hooks/userOrderSet";

// Types
import type { Product } from "../types/product.type";
import type { Picture } from "../types/picture.type";

// --- Utility Functions ---

/**
 * Formats a number as a price string (Toman).
 */
const formatPrice = (price: string | number | null | undefined): string => {
    if (price === null || price === undefined) return "";
    const numPrice = typeof price === "string" ? parseInt(price) : price;
    return new Intl.NumberFormat("fa-IR").format(numPrice) + " تومان";
};

/**
 * Formats a date string to a localized date string.
 */
const formatDate = (date: string | null | undefined): string => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fa-IR", { year: 'numeric', month: 'long', day: 'numeric' });
};

// --- Components ---

/**
 * A reusable row component for displaying label-value pairs.
 */
interface InfoRowProps {
    label: string;
    value: React.ReactNode;
    className?: string;
    isLast?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, className = "", isLast = false }) => (
    <div className={`flex justify-between items-center py-3 ${!isLast ? "border-b border-gray-100" : ""} ${className}`}>
        <span className="text-gray-500 font-medium text-sm">{label}</span>
        <div className="font-semibold text-gray-800 text-sm text-left dir-ltr">{value}</div>
    </div>
);

/**
 * A card-style section container with a title and icon.
 */
interface SectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

const Section: React.FC<SectionProps> = ({ title, icon, children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300 ${className}`}>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
            {icon && <span className="p-1.5 bg-gray-50 rounded-lg text-gray-600">{icon}</span>}
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-1">{children}</div>
    </div>
);

/**
 * Badge component to display countdown for reserved products.
 */
const CountdownBadge: React.FC<{ reversedTo: string | null | undefined }> = ({ reversedTo }) => {
    const [countdown, setCountdown] = useState<string>("");

    useEffect(() => {
        if (!reversedTo) {
            setCountdown("");
            return;
        }
        const target = new Date(reversedTo).getTime();
        if (isNaN(target)) return;

        const update = () => {
            const diff = target - Date.now();
            if (diff <= 0) {
                setCountdown("پایان یافته");
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            const timeStr = days > 0
                ? `${days} روز و ${hours} ساعت`
                : `${hours}:${minutes.toString().padStart(2, '0')}`;
            setCountdown(timeStr);
        };

        update();
        const id = setInterval(update, 60000); // Update every minute to save resources
        return () => clearInterval(id);
    }, [reversedTo]);

    if (!reversedTo || !countdown) return null;

    return (
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${countdown === "پایان یافته" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
            <BiTime className="text-lg" />
            <span>{countdown === "پایان یافته" ? "زمان رزرو پایان یافت" : countdown}</span>
        </div>
    );
};

/**
 * Interactive Image Gallery Component.
 */
const ProductGallery: React.FC<{ pictures: Picture[] }> = ({ pictures }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!pictures || pictures.length === 0) {
        return (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center aspect-square text-gray-400">
                <BiImage size={48} />
                <span className="mt-2 text-sm font-medium">تصویری موجود نیست</span>
            </div>
        );
    }

    const selectedImage = pictures[selectedIndex];
    const imageUrl = (path: string | null | undefined) => {
        if (!path) return "/placeholder.png";
        return path.startsWith("http") ? path : `https://shikala.com${path}`;
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 aspect-[4/3] flex items-center justify-center overflow-hidden relative group">
                <img
                    src={imageUrl(selectedImage.file)}
                    alt={selectedImage.name || "Product"}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }} 
                />
            </div>

            {/* Thumbnails */}
            {pictures.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {pictures.map((pic, idx) => (
                        <button
                            key={pic.id || idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
                                selectedIndex === idx 
                                    ? "border-blue-500 ring-2 ring-blue-100" 
                                    : "border-transparent hover:border-gray-300"
                            }`}
                        >
                            <img 
                                src={imageUrl(pic.file)} 
                                alt="" 
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Main Page Component ---

const DetailProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // Data Fetching
    const { data: user } = useUser();
    const { data: product, isLoading, error } = useDetailProduct(id ?? "");
    const { isPending: isPendingOrderSet, mutate: mutateOrderSet } = useOrderSet(Number(id));

    // Derived State
    const isBusiness = user?.type_client === "business";
    
    const statusConfig = useMemo(() => {
        const config: Record<string, { text: string; bg: string; textCol: string }> = {
            open: { text: "قابل سفارش", bg: "bg-emerald-50", textCol: "text-emerald-700" },
            saled: { text: "فروخته شده", bg: "bg-blue-50", textCol: "text-blue-700" },
            canseled: { text: "لغو شده", bg: "bg-rose-50", textCol: "text-rose-700" },
            reserved: { text: "رزرو شده", bg: "bg-amber-50", textCol: "text-amber-700" },
        };
        return config[product?.status_product || ""] || { text: "نامشخص", bg: "bg-gray-100", textCol: "text-gray-600" };
    }, [product?.status_product]);

    const typeConfig = useMemo(() => {
        const config: Record<string, string> = {
            new: "نو (آکبند)",
            "as new": "در حد نو",
            used: "کارکرده",
        };
        return config[product?.type_product || ""] || "-";
    }, [product?.type_product]);

    const handleOrder = () => {
        mutateOrderSet(undefined, {
            onSuccess: () => {
                toast.success("درخواست شما با موفقیت ثبت شد");
                queryClient.invalidateQueries({ queryKey: ["detailProduct", id ?? ""] });
            },
            onError: () => toast.error("خطا در ثبت درخواست"),
        });
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 animate-pulse">در حال دریافت اطلاعات...</p>
            </div>
        );
    }

    // Error State
    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <BiXCircle className="text-4xl text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">خطا در دریافت اطلاعات</h2>
                <p className="text-gray-600 mb-6 max-w-md">{error?.message || "محصول مورد نظر یافت نشد. ممکن است حذف شده باشد."}</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                    بازگشت به لیست
                </button>
            </div>
        );
    }

    // Main Content
    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-12 font-sans text-right" dir="rtl">
            {/* Navbar / Header Area (Simplified) */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <BiArrowBack className="text-xl" />
                        <span className="hidden sm:inline font-medium">بازگشت</span>
                    </button>
                    <h1 className="text-sm sm:text-lg font-bold text-gray-800 truncate max-w-[200px] sm:max-w-md">
                        {product.model_mobile?.model_name}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Right Column: Gallery (Desktop: 4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <ProductGallery pictures={product.picture || []} />
                        
                        {/* Mobile Info Card (Visible on all sizes, acts as summary) */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-700 mb-3">خلاصه وضعیت</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusConfig.bg} ${statusConfig.textCol}`}>
                                    {statusConfig.text}
                                </span>
                                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">
                                    {typeConfig}
                                </span>
                                {product.is_available && (
                                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 flex items-center gap-1">
                                        <BiCheckCircle /> موجود
                                    </span>
                                )}
                            </div>
                             {product.reversed_to && (
                                <div className="mt-3">
                                    <CountdownBadge reversedTo={product.reversed_to} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Column: Specs (Desktop: 5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Main Specs */}
                        <Section title="مشخصات اصلی" icon={<BiMobile className="text-xl" />}>
                            <InfoRow label="مدل" value={product.model_mobile?.model_name} />
                            <InfoRow label="برند" value={product.model_mobile?.brand} />
                            <InfoRow label="رنگ" value={
                                <div className="flex items-center gap-2">
                                    {typeof product.color === 'object' ? (
                                        <>
                                            <span className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: product.color.hex_code || '#eee' }}></span>
                                            <span>{product.color.name}</span>
                                        </>
                                    ) : (product.color || "-")}
                                </div>
                            } />
                            <InfoRow label="پارت نامبر" value={product.part_num || "-"} />
                        </Section>

                        {/* Battery & Health */}
                        <Section title="وضعیت سلامت و باتری" icon={<BiBattery className="text-xl" />}>
                            <InfoRow label="سلامت باتری" value={
                                product.battry_health ? (
                                    <div className="flex items-center gap-3 w-full max-w-[140px]">
                                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${product.battry_health > 80 ? 'bg-emerald-500' : product.battry_health > 60 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                                                style={{ width: `${product.battry_health}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{product.battry_health}%</span>
                                    </div>
                                ) : "-"
                            } />
                            <InfoRow label="سایکل شارژ" value={product.charge_cicle ?? "-"} />
                            <InfoRow label="تعویض باتری" value={
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${product.battry_change ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                                    {product.battry_change ? "تعویض شده" : "فابریک"}
                                </span>
                            } />
                            <InfoRow label="وضعیت تعمیر" value={
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${product.repaired ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                                    {product.repaired ? "تعمیر شده" : "بدون تعمیر"}
                                </span>
                            } />
                             <InfoRow label="رجیستری" value={
                                <span className={`flex items-center gap-1 ${product.registered ? "text-emerald-600" : "text-rose-600"}`}>
                                    {product.registered ? <BiCheckCircle /> : <BiXCircle />}
                                    {product.registered ? "دارد" : "ندارد"}
                                </span>
                            } isLast />
                        </Section>

                        {/* Description */}
                        <Section title="توضیحات تکمیلی" icon={<BiInfoCircle className="text-xl" />}>
                            <div className="text-sm leading-7 text-gray-700 space-y-4">
                                {product.description && (
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <span className="block text-xs font-bold text-gray-500 mb-1">توضیحات فروشنده:</span>
                                        {product.description}
                                    </div>
                                )}
                                {product.description_appearance && (
                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-900">
                                        <span className="block text-xs font-bold text-blue-500 mb-1">وضعیت ظاهری:</span>
                                        {product.description_appearance}
                                    </div>
                                )}
                                {product.technical_problem && (
                                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-rose-900">
                                        <span className="block text-xs font-bold text-rose-500 mb-1">مشکلات فنی:</span>
                                        {product.technical_problem}
                                    </div>
                                )}
                            </div>
                        </Section>

                        {/* Camera Info */}
                        {product.camera && product.camera.length > 0 && (
                            <Section title={`دوربین (${product.camera.length})`} icon={<BiCamera className="text-xl" />}>
                                {product.camera.map((cam, idx) => (
                                    <div key={idx} className="mb-3 last:mb-0 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-gray-700 text-sm">{cam.name || `دوربین ${idx + 1}`}</span>
                                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg font-medium">{cam.resolution || "?"}</span>
                                        </div>
                                        {cam.description && <p className="text-xs text-gray-500 mt-1">{cam.description}</p>}
                                    </div>
                                ))}
                            </Section>
                        )}

                        {/* Dates */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-xs text-gray-400 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                <span>تاریخ ثبت آگهی:</span>
                                <span className="text-gray-600 font-medium">{formatDate(product.register_date || product.created_at)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>آخرین بروزرسانی:</span>
                                <span className="text-gray-600 font-medium">{formatDate(product.updated_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Left Column: Purchase Action (Desktop: 3 cols) */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <BiShoppingBag className="text-blue-600" />
                                <span>خرید محصول</span>
                            </h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-gray-500 text-sm">قیمت:</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black text-gray-900">
                                            {formatPrice(isBusiness ? product.price : product.customer_price)}
                                        </span>
                                        {isBusiness && (
                                            <span className="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded-full mt-1">همکار</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">گارانتی:</span>
                                    <span className="font-medium text-gray-800">{product.guarantor ? `${product.guarantor} ماه` : "ندارد"}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleOrder}
                                disabled={isPendingOrderSet || !product.is_available || product.status_product !== 'open'}
                                className={`w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all duration-300 shadow-md flex items-center justify-center gap-2
                                    ${(isPendingOrderSet || !product.is_available || product.status_product !== 'open')
                                        ? "bg-gray-300 cursor-not-allowed shadow-none" 
                                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"}`}
                            >
                                {isPendingOrderSet ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        <span>در حال پردازش...</span>
                                    </>
                                ) : (
                                    <>
                                        {product.status_product === 'open' && product.is_available ? (
                                            <>
                                                <BiShoppingBag className="text-xl" />
                                                <span>ثبت سفارش</span>
                                            </>
                                        ) : (
                                            <span>غیر قابل سفارش</span>
                                        )}
                                    </>
                                )}
                            </button>

                            {/* Seller Info */}
                            {product.seller && (
                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <BiShield className="text-emerald-500 text-lg" />
                                    </div>
                                    <span>کد فروشنده: {String(product.seller)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DetailProductPage;
