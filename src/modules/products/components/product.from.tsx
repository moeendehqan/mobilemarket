import React, { useState } from "react";
import useAddProduct from "../hooks/useAddProduct";
import useAddCamera from "../hooks/useAddCamera";
import useAddPicture from "../hooks/addPicture";
import { toast } from "react-hot-toast";
import useModelMobile from "../hooks/useModelMobile";

interface NewCamera {
  name: string;
  resolution: string;
  description: string;
}

const MOBILE_BRANDS = [
  "Samsung",
  "Apple",
  "Xiaomi",
  "Huawei",
  "OnePlus",
  "Sony",
  "LG",
  "Nokia",
  "Motorola",
  "Google",
  "ASUS",
  "Lenovo",
  "HP",
  "Dell",
  "Acer",
  "MSI",
];

const DEVICE_COLORS = [
  { name: "مشکی", value: "#000000" },
  { name: "سفید", value: "#FFFFFF" },
  { name: "طلایی", value: "#FFD700" },
  { name: "نقره‌ای", value: "#C0C0C0" },
  { name: "خاکستری", value: "#808080" },
  { name: "آبی", value: "#0000FF" },
  { name: "قرمز", value: "#FF0000" },
  { name: "صورتی", value: "#FFC0CB" },
];

interface FormDataType {
  name: string;
  description: string;
  price: string;
  brand: string;
  color: string;
  part_number: string;
  ram: string;
  sim_card: string;
  battery: string;
  battery_health: string;
  battery_changed: boolean;
  size: string;
  charger: boolean;
  carton: boolean;
  type_product?: "new" | "as new" | "used" | null;
  technical_problem: string;
  hit_product: boolean;
  register_date: string;
  registered: boolean;
  guarantor: string;
  repaired: boolean;
  status_product: string;
  pictures: File[];
}

const LabelInput: React.FC<{
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
}> = ({ label, children, required, error }) => (
  <div className="flex flex-col gap-3">
    <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
      {label}
      {required && <span className="text-red-500 mr-1 text-lg">*</span>}
    </label>
    {children}
    {error && <span className="text-red-500 text-sm mt-1 font-medium flex items-center gap-1">
      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
      {error}
    </span>}
  </div>
);

const ProductForm: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
    price: "",
    brand: "",
    color: "",
    part_number: "",
    ram: "",
    sim_card: "",
    battery: "",
    battery_health: "",
    battery_changed: false,
    size: "",
    charger: false,
    carton: false,
    type_product: null,
    technical_problem: "",
    hit_product: false,
    register_date: "",
    registered: false,
    guarantor: "",
    repaired: false,
    status_product: "",
    pictures: [],
  });

  const { mutateAsync: mutateProduct, isPending: isPendingProduct } = useAddProduct();
  const { mutateAsync: mutateCamera, isPending: isPendingCamera } = useAddCamera();
  const { mutateAsync: mutatePicture, isPending: isPendingPicture } = useAddPicture();

  const [newCameras, setNewCameras] = useState<NewCamera[]>([
    { name: "", resolution: "", description: "" },
  ]);

  const [errors, setErrors] = useState<Partial<FormDataType>>({});

  const validateForm = () => {
    const newErrors: Partial<FormDataType> = {};
    if (!formData.name) newErrors.name = "نام محصول الزامی است";
    if (!formData.price) {
      newErrors.price = "قیمت الزامی است";
    } else if (!/^\d+$/.test(formData.price) || parseInt(formData.price) <= 0) {
      newErrors.price = "قیمت باید عدد مثبت باشد";
    }
    if (!formData.brand) newErrors.brand = "برند الزامی است";
    if (!formData.color) newErrors.color = "رنگ الزامی است";
    if (formData.ram && !/^\d+$/.test(formData.ram)) {
      newErrors.ram = "مقدار رم باید عدد باشد";
    }
    if (formData.sim_card && !/^[1-2]$/.test(formData.sim_card)) {
      newErrors.sim_card = "تعداد سیم‌کارت باید 1 یا 2 باشد";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      setFormData(prev => ({ ...prev, pictures: Array.from(files) }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    if (errors[name as keyof FormDataType]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCameraChange = (index: number, field: keyof NewCamera, value: string) => {
    setNewCameras(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addNewCamera = () => {
    setNewCameras(prev => [...prev, { name: "", resolution: "", description: "" }]);
  };

  const removeCamera = (index: number) => {
    setNewCameras(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("لطفا همه فیلدهای الزامی را پر کنید");
      return;
    }

    try {
      const pictureIds: number[] = [];
      for (const file of formData.pictures) {
        try {
          const picForm = new FormData();
          picForm.append("file", file);
          picForm.append("name", file.name);
          const response = await mutatePicture(picForm);
          if (response && response.id) {
            pictureIds.push(response.id);
          } else {
            toast.error(`خطا در آپلود تصویر ${file.name}`);
          }
        } catch (error) {
          console.error(`خطا در آپلود تصویر ${file.name}:`, error);
          toast.error(`خطا در آپلود تصویر ${file.name}`);
        }
      }

      const createdCameraIds: number[] = [];
      for (const cam of newCameras) {
        if (cam.name && cam.resolution) {
          try {
            const response = await mutateCamera(cam);
            if (response && response.id) {
              createdCameraIds.push(response.id);
            } else {
              toast.error(`خطا در ثبت دوربین ${cam.name}`);
            }
          } catch (error) {
            console.error(`خطا در ثبت دوربین ${cam.name}:`, error);
            toast.error(`خطا در ثبت دوربین ${cam.name}`);
          }
        }
      }

      if (pictureIds.length === 0 && formData.pictures.length > 0) {
        toast.error("خطا در آپلود تصاویر");
        return;
      }

      if (createdCameraIds.length === 0 && newCameras.some(cam => cam.name && cam.resolution)) {
        toast.error("خطا در ثبت دوربین‌ها");
        return;
      }

      const payload = {
        ...formData,
        price: parseInt(formData.price),
        ram: formData.ram ? parseInt(formData.ram) : undefined,
        sim_card: formData.sim_card ? parseInt(formData.sim_card) : undefined,
        picture: pictureIds,
        camera: createdCameraIds,
      };

      const response = await mutateProduct(payload);
      if (response) {
        toast.success("محصول با موفقیت ایجاد شد");
      } else {
        toast.error("خطا در ایجاد محصول");
      }
    } catch (error) {
      console.error("خطا در ایجاد محصول:", error);
      toast.error("خطا در ایجاد محصول");
    }
  };

  const isSubmitting = isPendingProduct || isPendingCamera || isPendingPicture;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">📱</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">افزودن محصول جدید</h1>
          </div>
          <p className="text-gray-600 font-medium">اطلاعات کامل محصول را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 border border-white/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <LabelInput label="نام محصول" required error={errors.name}>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="نام محصول را وارد کنید..."
                className={`w-full border-2 ${errors.name ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium`}
              />
            </LabelInput>

            <LabelInput label="قیمت" required error={errors.price}>
              <input
                type="number"
                name="price"
                min="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="قیمت به تومان..."
                className={`w-full border-2 ${errors.price ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium`}
              />
            </LabelInput>

            <LabelInput label="برند" required error={errors.brand}>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`w-full border-2 ${errors.brand ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium`}
              >
                <option value="">انتخاب کنید</option>
                {MOBILE_BRANDS.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </LabelInput>

            <LabelInput label="رنگ" required error={errors.color}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DEVICE_COLORS.map(({ name, value }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.color === value ? 'ring-4 ring-blue-400 ring-opacity-30 border-blue-400 bg-blue-50/50 shadow-lg' : 'border-gray-200 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50/20 hover:shadow-lg'}`}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={value}
                      checked={formData.color === value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span
                      className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-md"
                      style={{ backgroundColor: value }}
                    />
                    <span className="text-sm font-medium">{name}</span>
                  </label>
                ))}
              </div>
            </LabelInput>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <LabelInput label="رم" error={errors.ram}>
              <input
                type="number"
                name="ram"
                min="1"
                max="32"
                value={formData.ram}
                onChange={handleChange}
                placeholder="مقدار رم به GB"
                className={`w-full border-2 ${errors.ram ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium`}
              />
            </LabelInput>

            <LabelInput label="نوع محصول">
              <select
                name="type_product"
                value={formData.type_product || ""}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium"
              >
                <option value="">انتخاب کنید</option>
                <option value="new">نو</option>
                <option value="as new">در حد نو</option>
                <option value="used">کارکرده</option>
              </select>
            </LabelInput>
            <LabelInput label="تعداد سیم کارت" error={errors.sim_card}>
              <select
                name="sim_card"
                value={formData.sim_card}
                onChange={handleChange}
                className={`w-full border-2 ${errors.sim_card ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium`}
              >
                <option value="">انتخاب کنید</option>
                <option value="1">تک سیم‌کارت</option>
                <option value="2">دو سیم‌کارت</option>
              </select>
            </LabelInput>

            <LabelInput label="تاریخ رجیستری">
              <input
                type="date"
                name="register_date"
                value={formData.register_date}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium"
              />
            </LabelInput>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <LabelInput label="توضیحات">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="توضیحات محصول را وارد کنید..."
                className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium resize-none"
              />
            </LabelInput>

            <LabelInput label="مشکل فنی">
              <textarea
                name="technical_problem"
                value={formData.technical_problem}
                onChange={handleChange}
                rows={4}
                placeholder="مشکلات فنی محصول را شرح دهید..."
                className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium resize-none"
              />
            </LabelInput>
          </div>

          <div className="mb-8">
            <LabelInput label="تصاویر محصول">
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-2xl px-5 py-3.5 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm file:mr-4 file:py-2 file:px-6 file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white file:rounded-xl hover:file:from-blue-600 hover:file:to-purple-600 file:transition-all file:duration-300 file:shadow-lg"
                />
                <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  فرمت‌های مجاز: JPG, PNG, GIF
                </div>
              </div>
            </LabelInput>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-6 sm:p-8 border-2 border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📷</span>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">دوربین‌ها</h3>
              </div>
              <button
                type="button"
                onClick={addNewCamera}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                افزودن دوربین جدید
              </button>
            </div>

            <div className="space-y-6">
              {newCameras.map((cam, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={cam.name}
                      onChange={(e) => handleCameraChange(idx, "name", e.target.value)}
                      placeholder="نام دوربین"
                      className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium"
                    />
                    <input
                      type="text"
                      value={cam.resolution}
                      onChange={(e) => handleCameraChange(idx, "resolution", e.target.value)}
                      placeholder="رزولوشن (مثال: 12MP)"
                      className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium"
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={cam.description}
                        onChange={(e) => handleCameraChange(idx, "description", e.target.value)}
                        placeholder="توضیحات"
                        className="flex-1 border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => removeCamera(idx)}
                        className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t-2 border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${isSubmitting ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'} text-white py-4 sm:py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg shadow-2xl hover:shadow-3xl`}
            >
              {isSubmitting && (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span className="w-2 h-2 bg-white rounded-full"></span>
              {isSubmitting ? "در حال ایجاد محصول..." : "ایجاد محصول"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;