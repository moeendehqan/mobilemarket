import React, { useState, useEffect, useRef } from "react";
import useAddProduct from "../hooks/useAddProduct";
import useAddPicture from "../hooks/addPicture";
import { toast } from "react-hot-toast";
import useModelMobile from "../hooks/useModelMobile";
import type { modelMobileType } from "../types/modelmobile.type";
import type { Color } from "../types/color.type";
import { usePartNumber } from "../hooks/usePartNumber";



const CARTON_OPTIONS = [
  { value: "orginal", label: "اصلی" },
  { value: "repakage", label: "ریپک" },
];

const GRADE_OPTIONS = [
  { value: "A", label: "A - درحد نو" },
  { value: "B", label: "B - خط و خش جزئی" },
  { value: "C", label: "C - خط و خش و ضربه" },
  { value: "D", label: "D - نیاز به تعمیر" },
];

// کامپوننت: ProductForm

interface FormDataType {
  description: string;
  description_appearance: string;
  technical_problem: string;
  price: string;
  customer_price: string;
  color: number | null | string;
  battry_health: string;
  battry_change: boolean;
  type_product?: "new" | "as new" | "used" | null;
  auction: boolean;
  guarantor: string;
  repaired: boolean;
  part_num: string;
  status_product: string;
  carton: string;
  grade: string;
  model_mobile: number | string | null;
  pictures: File[];
}

const LabelInput: React.FC<{
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string | null;
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
    description: "",
    description_appearance: "",
    technical_problem: "",
    price: "",
    customer_price: "",
    color: null,
    battry_health: "",
    battry_change: false,
    type_product: null,
    auction: false,
    guarantor: "",
    repaired: false,
    part_num: "",
    status_product: "open",
    carton: "",
    grade: "",
    model_mobile: null,
    pictures: [],
  });

  const { mutateAsync: mutateProduct, isPending: isPendingProduct } = useAddProduct();
  const { mutateAsync: mutatePicture, isPending: isPendingPicture } = useAddPicture();
  const { data: modelMobiles, isLoading: isLoadingModels } = useModelMobile();

  const [selectedModel, setSelectedModel] = useState<modelMobileType | null>(null);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showColorDropdown, setShowColorDropdown] = useState<boolean>(false);
  const [colorSearch, setColorSearch] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const steps = [
    "مدل و رنگ",
    "قیمت و مزایده",
    "مشخصات فنی",
    "تصاویر و ظاهر",
  ];
  // Explicit step index type to avoid literal-type comparison warnings (ts2367)
  type StepIndex = 0 | 1 | 2 | 3;
  const [currentStep, setCurrentStep] = useState<StepIndex>(0);

  const validateStep = (step: StepIndex) => {
    const newErrors: Partial<FormDataType> = {};
    if (step === 0) {
      if (!formData.model_mobile) newErrors.model_mobile = "انتخاب مدل موبایل الزامی است";
      if (!formData.color) newErrors.color = "انتخاب رنگ الزامی است";
    } else if (step === 1) {
      if (!formData.price) newErrors.price = "قیمت الزامی است";
      else if (!/^\d+$/.test(formData.price) || parseInt(formData.price) <= 0) newErrors.price = "قیمت باید عدد مثبت باشد";
      // اعتبارسنجی قیمت مشتری (اختیاری، در صورت وارد شدن باید مثبت باشد)
      if (formData.customer_price && (!/^\d+$/.test(formData.customer_price) || parseInt(formData.customer_price) <= 0)) {
        newErrors.customer_price = "قیمت مشتری باید عدد مثبت باشد";
      }
    } else if (step === 2) {
      if (selectedModel?.is_apple && formData.type_product !== "new") {
        if (
          formData.battry_health &&
          (!/^\d+$/.test(formData.battry_health) ||
            parseInt(formData.battry_health) < 0 ||
            parseInt(formData.battry_health) > 100)
        ) {
          newErrors.battry_health = "سلامت باتری باید عددی بین 0 تا 100 باشد";
        }
      }
      if (formData.guarantor && !/^\d+$/.test(formData.guarantor)) newErrors.guarantor = "ضامن باید عدد باشد";
    } else if (step === 3) {
      if (formData.type_product === "used" && !formData.description) newErrors.description = "توضیحات الزامی است";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => (s < (steps.length - 1) ? ((s + 1) as StepIndex) : s));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => (s > 0 ? ((s - 1) as StepIndex) : s));
  };

  const onFormSubmit = (e: React.FormEvent) => {
    if (currentStep === steps.length - 1) {
      handleSubmit(e);
    } else {
      e.preventDefault();
      handleNext();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setShowColorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [errors, setErrors] = useState<Partial<FormDataType>>({});
  const { data: partNumbers } = usePartNumber();

  const validateForm = () => {
    const newErrors: Partial<FormDataType> = {};
    if (formData.type_product === "used" && !formData.description) newErrors.description = "توضیحات الزامی است";
    if (!formData.price) {
      newErrors.price = "قیمت الزامی است";
    } else if (!/^\d+$/.test(formData.price) || parseInt(formData.price) <= 0) {
      newErrors.price = "قیمت باید عدد مثبت باشد";
    }
    // اعتبارسنجی قیمت مشتری (اختیاری)
    if (formData.customer_price && (!/^\d+$/.test(formData.customer_price) || parseInt(formData.customer_price) <= 0)) {
      newErrors.customer_price = "قیمت مشتری باید عدد مثبت باشد";
    }
    if (!formData.model_mobile) newErrors.model_mobile = "انتخاب مدل موبایل الزامی است";
    if (!formData.color) newErrors.color = "انتخاب رنگ الزامی است";
    if (formData.battry_health && (!/^\d+$/.test(formData.battry_health) || parseInt(formData.battry_health) < 0 || parseInt(formData.battry_health) > 100)) {
      newErrors.battry_health = "سلامت باتری باید عددی بین 0 تا 100 باشد";
    }
    if (formData.guarantor && !/^\d+$/.test(formData.guarantor)) {
      newErrors.guarantor = "ضامن باید عدد باشد";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      setFormData(prev => ({ ...prev, pictures: Array.from(files) }));
    } else {
      let processedValue: any = value;
      if (name === "color" || name === "model_mobile" || name === "guarantor") {
        processedValue = value ? parseInt(value) : null;
      } else if (name === "battry_health") {
        processedValue = value ? parseInt(value) : "";
      }
      
      if (name === "grade") {
        setFormData(prev => ({
          ...prev,
          [name]: processedValue,
          technical_problem: processedValue === "D" ? prev.technical_problem : "",
          description_appearance: processedValue === "A" ? "" : prev.description_appearance,
          description: ""
        }));
      } else if (name === "type_product") {
        if (processedValue === "new") {
          setFormData(prev => ({
            ...prev,
            [name]: processedValue,
            grade: "A",
            battry_change: false,
            repaired: false,
            battry_health: "100"
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [name]: processedValue
          }));
        }
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === "checkbox" ? checked : processedValue,
        }));
      }
    }
    if (errors[name as keyof FormDataType]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleModelSelect = (model: modelMobileType) => {
    setSelectedModel(model);
    setAvailableColors(model.colors || []);
    setSearchTerm(`${model.model_name} - ${model.brand}`);
    setShowDropdown(false);
    setFormData(prev => ({ 
      ...prev, 
      model_mobile: model.id,
      color: null,
      part_num: model.is_apple ? (model.part_number || '') : '',
      battry_health: model.is_apple ? prev.battry_health : '85',
      carton: model.is_apple ? prev.carton : 'orginal'
    }));
    if (errors.model_mobile) {
      setErrors(prev => ({ ...prev, model_mobile: undefined }));
    }
  };

  const handleColorSelect = (colorId: number) => {
    setFormData(prev => ({ ...prev, color: colorId }));
    setShowColorDropdown(false);
    if (errors.color) {
      setErrors(prev => ({ ...prev, color: undefined }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    if (value === '') {
      setSelectedModel(null);
      setAvailableColors([]);
      setFormData(prev => ({ ...prev, model_mobile: null, color: null, part_num: '' }));
    }
  };

  const filteredModels = modelMobiles?.filter(model => 
    model.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.brand.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredColors = colorSearch.trim()
    ? availableColors.filter(c =>
        (c.name || "").toLowerCase().includes(colorSearch.toLowerCase()) ||
        (c.hex_code || "").toLowerCase().includes(colorSearch.toLowerCase())
      )
    : availableColors;

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

      if (pictureIds.length === 0 && formData.pictures.length > 0) {
        toast.error("خطا در آپلود تصاویر");
        return;
      }

      // داخل handleSubmit: ساخت payload برای ارسال به بک‌اند
      const payload: any = {
        ...formData,
        price: parseInt(formData.price),
        customer_price: formData.customer_price ? parseInt(formData.customer_price) : undefined,
        battry_health: formData.battry_health ? parseInt(formData.battry_health) : 0,
        guarantor: formData.guarantor ? parseInt(formData.guarantor) : 0,
        model_mobile: {
          id: formData.model_mobile,
          picture: []
        },
        color: formData.color,
      };
      
      if (pictureIds.length > 0) {
        payload.picture = pictureIds.map(id => ({ id }));
      }

      const response = await mutateProduct(payload);
      if (response) {
        toast.success("محصول با موفقیت ایجاد شد");
        setFormData({
          description: "",
          description_appearance: "",
          technical_problem: "",
          price: "",
          customer_price: "",
          color: null,
          battry_health: "",
          battry_change: false,
          type_product: null,
          auction: false,
          guarantor: "",
          repaired: false,
          part_num: "",
          status_product: "open",
          carton: "",
          grade: "",
          model_mobile: null,
          pictures: [],
        });
        setSelectedModel(null);
        setAvailableColors([]);
        setSearchTerm("");
        setShowDropdown(false);
        setErrors({});
      } else {
        toast.error("خطا در ایجاد محصول");
      }
    } catch (error) {
      console.error("خطا در ایجاد محصول:", error);
      toast.error("خطا در ایجاد محصول");
    }
  };

  const isSubmitting = isPendingProduct || isPendingPicture;

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

        <form onSubmit={onFormSubmit} className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 border border-white/50">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {steps.map((label, idx) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{idx + 1}</div>
                  <span className={`text-sm ${idx === currentStep ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>{label}</span>
                  {idx !== steps.length - 1 && <span className="w-6 h-[2px] bg-gray-300 mx-1 hidden sm:inline-block"></span>}
                </div>
              ))}
            </div>
          </div>
          {/* انتخاب مدل موبایل و رنگ - مرحله 1 */}
          {currentStep === 0 && (
          <>
          <div className="mb-8">
            <LabelInput label="انتخاب مدل موبایل" required error={errors.model_mobile as string}>
              <div className="relative" ref={dropdownRef}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(searchTerm.length > 0)}
                  placeholder="جستجو مدل موبایل..."
                  className={`w-full border-2 ${errors.model_mobile ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium`}
                  disabled={isLoadingModels}
                />
                
                {isLoadingModels && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
                
                {showDropdown && !isLoadingModels && filteredModels.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                    {filteredModels.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => handleModelSelect(model)}
                        className="p-4 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 flex items-center gap-4"
                      >
                        {model.pictures && model.pictures.length > 0 && (
                          <img
                            src={model.pictures[0].file}
                            alt={model.model_name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 text-right">
                          <div className="text-sm font-bold text-gray-800">{model.model_name}</div>
                          <div className="text-xs text-gray-600">{model.brand}</div>
                          <div className="text-xs text-gray-500 mt-1">{model.part_number}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {showDropdown && !isLoadingModels && filteredModels.length === 0 && searchTerm.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-4 text-center text-gray-500">
                    مدلی با این نام پیدا نشد
                  </div>
                )}
              </div>
            </LabelInput>
          </div>



          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <LabelInput label="رنگ" required error={errors.color as string}>
              <div className="relative" ref={colorDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowColorDropdown(!showColorDropdown)}
                  className={`w-full border-2 ${errors.color ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium flex items-center justify-between`}
                >
                  {formData.color ? (
                    <div className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-md"
                        style={{ backgroundColor: availableColors.find(c => c.id === formData.color)?.hex_code || '#ccc' }}
                      />
                      <span>{availableColors.find(c => c.id === formData.color)?.name || 'انتخاب شده'}</span>
                    </div>
                  ) : (
                    <span>انتخاب رنگ...</span>
                  )}
                  <span className="text-gray-400">▼</span>
                </button>
                {showColorDropdown && availableColors.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
                    <div className="sticky top-0 bg-white p-3 border-b border-gray-100">
                      <input
                        type="text"
                        value={colorSearch}
                        onChange={(e) => setColorSearch(e.target.value)}
                        placeholder="جستجوی رنگ..."
                        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="p-3 grid grid-cols-3 gap-2 justify-items-center">
                      {filteredColors.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => handleColorSelect(color.id)}
                          className={`group flex flex-col items-center gap-1 px-2 py-2 rounded-xl border-2 transition-all duration-200 ${formData.color === color.id ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'}`}
                          title={color.name}
                          aria-label={color.name}
                        >
                          <span
                            className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border border-gray-300 shadow-sm"
                            style={{ backgroundColor: color.hex_code }}
                          />
                          <span className="hidden sm:block text-[11px] text-gray-700 truncate w-20 text-center">{color.name}</span>
                        </button>
                      ))}
                    </div>
                    {filteredColors.length === 0 && (
                      <div className="p-4 text-center text-sm text-gray-500">رنگی مطابق جستجو یافت نشد</div>
                    )}
                  </div>
                )}
              </div>
            </LabelInput>
          </div>
          </>
          )}

          {currentStep === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <LabelInput label={formData.auction ? "قیمت پایه" : "قیمت"} required error={errors.price}>
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
          
            <LabelInput label="قیمت مشتری" error={errors.customer_price as string}>
              <input
                type="number"
                name="customer_price"
                min="1"
                value={formData.customer_price}
                onChange={handleChange}
                placeholder="قیمت مشتری به تومان..."
                className={`w-full border-2 ${errors.customer_price ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium`}
              />
            </LabelInput>

            {/* <LabelInput label="نوع فروش">
              <div className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border-2 border-gray-200 shadow-lg">
                <input
                  type="checkbox"
                  name="auction"
                  checked={formData.auction}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label className="text-sm font-medium text-gray-800">مزایده</label>
              </div>
            </LabelInput> */}
          </div>
          )}

          {currentStep === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {selectedModel?.is_apple && formData.type_product !== "new" && (
              <LabelInput label="سلامت باتری (درصد)" error={errors.battry_health}>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="battry_health"
                    min="0"
                    max="100"
                    value={formData.battry_health}
                    onChange={handleChange}
                    placeholder="سلامت باتری به درصد"
                    className={`w-full border-2 ${errors.battry_health ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium`}
                  />
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border-2 border-gray-200 shadow-lg">
                    <input
                      type="checkbox"
                      name="battry_change"
                      checked={formData.battry_change}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label className="text-sm font-medium text-gray-800">باتری تعویض شده</label>
                  </div>
                </div>
              </LabelInput>
            )}

            <LabelInput label="نوع محصول">
              <select
                name="type_product"
                value={formData.type_product || ""}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium"
              >
                <option value="">انتخاب کنید</option>
                <option value="new">نو</option>
                <option value="used">کارکرده</option>
              </select>
            </LabelInput>

            {formData.type_product !== "new" && (
              <LabelInput label="درجه کیفیت">
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium"
                >
                  <option value="">انتخاب کنید</option>
                  {GRADE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </LabelInput>
            )}

            <LabelInput label="مانده گارانتی" error={errors.guarantor}>
              <input
                type="number"
                name="guarantor"
                min="0"
                value={formData.guarantor}
                onChange={handleChange}
                placeholder="مدت به ماه"
                className={`w-full border-2 ${errors.guarantor ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium`}
              />
            </LabelInput>

            {selectedModel?.is_apple && (
              <LabelInput label="کارتن">
                <select
                  name="carton"
                  value={formData.carton}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium"
                >
                  <option value="">انتخاب کنید</option>
                  {CARTON_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </LabelInput>
            )}

            {selectedModel?.is_apple && (
              <LabelInput label="پارت نامبر">
                <select
                  name="part_num"
                  value={formData.part_num}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium"
                >
                  <option value="">انتخاب کنید</option>
                  {partNumbers?.map((partNumber) => (
                    <option key={partNumber.id} value={partNumber.pard_number}>{partNumber.pard_number}</option>
                  ))}
                </select>
              </LabelInput>
            )}

            {formData.type_product !== "new" && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border-2 border-gray-200 shadow-lg">
                <input
                  type="checkbox"
                  name="repaired"
                  checked={formData.repaired}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label className="text-sm font-medium text-gray-800">تعمیر شده</label>
              </div>
            )}
          </div>
          )}

          {currentStep === 3 && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {formData.type_product === "used" && (
              <LabelInput label="توضیحات" required error={errors.description}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="توضیحات محصول را وارد کنید..."
                  className={`w-full border-2 ${errors.description ? 'border-red-400 focus:ring-red-400 bg-red-50/50' : 'border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium resize-none`}
                />
              </LabelInput>
            )}

            {(formData.grade === "C" || formData.grade === "D") && (
              <LabelInput label="توضیحات ظاهری">
                <textarea
                  name="description_appearance"
                  value={formData.description_appearance}
                  onChange={handleChange}
                  rows={4}
                  placeholder="توضیحات ظاهری محصول را وارد کنید..."
                  className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium resize-none"
                />
              </LabelInput>
            )}

            {formData.grade === "D" && (
              <LabelInput label="مشکلات فنی">
                <textarea
                  name="technical_problem"
                  value={formData.technical_problem}
                  onChange={handleChange}
                  rows={4}
                  placeholder="مشکلات فنی محصول را شرح دهید..."
                  className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium resize-none"
                />
              </LabelInput>
            )}

            <LabelInput label="تصاویر محصول">
              <input
                type="file"
                name="pictures"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="w-full border-2 border-gray-200 focus:ring-blue-400 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-opacity-30 text-right transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.pictures.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  {formData.pictures.length} فایل انتخاب شده
                </div>
              )}
            </LabelInput>
          </div>
          )}

          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-lg disabled:opacity-60"
            >
              مرحله قبل
            </button>
            <button
              key={currentStep === steps.length - 1 ? "submit-btn" : "next-btn"}
              type="button"
              onClick={(e) => currentStep === steps.length - 1 ? handleSubmit(e as unknown as React.FormEvent) : handleNext()}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-10 rounded-2xl transition-all duration-300 shadow-2xl flex items-center gap-3"
            >
              {currentStep === steps.length - 1 ? (
                isSubmitting ? (
                  <>
                    <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <span className="text-xl">✨</span>
                    ایجاد محصول
                  </>
                )
              ) : (
                <>
                  مرحله بعد
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;