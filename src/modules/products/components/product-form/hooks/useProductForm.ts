import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import useAddProduct from "../../../hooks/useAddProduct";
import useAddPicture from "../../../hooks/addPicture";
import useModelMobile from "../../../hooks/useModelMobile";
import { usePartNumber } from "../../../hooks/usePartNumber";
import type { modelMobileType } from "../../../types/modelmobile.type";
import type { Color } from "../../../types/color.type";
import { FormDataType, StepIndex } from "../types";
import { STEPS } from "../constants";

export const useProductForm = () => {
  const [formData, setFormData] = useState<FormDataType>({
    description: "",
    description_appearance: "",
    technical_problem: "",
    price: "",
    customer_price: "",
    color: null,
    battry_health: "",
    battry_change: false,
    type_product: "new",
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

  const [errors, setErrors] = useState<Partial<FormDataType>>({});
  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  
  // Model & Color Search State
  const [selectedModel, setSelectedModel] = useState<modelMobileType | null>(null);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showColorDropdown, setShowColorDropdown] = useState<boolean>(false);
  const [colorSearch, setColorSearch] = useState<string>("");
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: mutateProduct, isPending: isPendingProduct } = useAddProduct();
  const { mutateAsync: mutatePicture, isPending: isPendingPicture } = useAddPicture();
  const { data: modelMobiles, isLoading: isLoadingModels } = useModelMobile();
  const { data: partNumbers } = usePartNumber();

  // Click Outside Handler
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Logic
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

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      setFormData(prev => ({ ...prev, pictures: Array.from(files) }));
    } else {
      let processedValue: any = value;
      if (["color", "model_mobile"].includes(name)) {
        processedValue = value ? parseInt(value) : null;
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
            grade: "",
            battry_change: false,
            repaired: false,
            battry_health: selectedModel?.is_apple ? "100" : ""
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [name]: processedValue,
            grade: processedValue === "used" ? "A" : ""
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
    setShowColorDropdown(false);
    setColorSearch("");
    setFormData(prev => ({ 
      ...prev, 
      model_mobile: model.id,
      color: null,
      part_num: model.is_apple ? (model.part_number || '') : '',
      battry_health: model.is_apple ? (prev.battry_health || '100') : '',
      carton: prev.carton || 'orginal'
    }));
    if (errors.model_mobile) setErrors(prev => ({ ...prev, model_mobile: undefined }));
  };

  const handleColorSelect = (colorId: number) => {
    setFormData(prev => ({ ...prev, color: colorId }));
    setShowColorDropdown(false);
    if (errors.color) setErrors(prev => ({ ...prev, color: undefined }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    if (value === '') {
      setSelectedModel(null);
      setAvailableColors([]);
      setFormData(prev => ({ ...prev, model_mobile: null, color: null, part_num: '' }));
      setShowColorDropdown(false);
      setColorSearch("");
    }
  };

  const validateStep = (step: StepIndex) => {
    const newErrors: Partial<FormDataType> = {};
    if (step === 0) {
      if (!formData.type_product) newErrors.type_product = "انتخاب نوع محصول الزامی است" as any;
      if (!formData.model_mobile) newErrors.model_mobile = "انتخاب مدل موبایل الزامی است";
      if (!formData.color) newErrors.color = "انتخاب رنگ الزامی است";
    } else if (step === 1) {
      if (selectedModel?.is_apple) {
        if (!formData.battry_health) {
          newErrors.battry_health = "سلامت باتری الزامی است";
        } else if (!/^\d+$/.test(formData.battry_health) || parseInt(formData.battry_health) < 0 || parseInt(formData.battry_health) > 100) {
          newErrors.battry_health = "سلامت باتری باید عددی بین 0 تا 100 باشد";
        }
        if (!formData.part_num) newErrors.part_num = "پارت نامبر الزامی است";
      }
      if (!formData.guarantor) newErrors.guarantor = "ضمانت باقی‌مانده الزامی است";
      else if (!/^\d+$/.test(formData.guarantor) || parseInt(formData.guarantor) < 0) newErrors.guarantor = "ضمانت باید عدد غیرمنفی باشد";
      if (!formData.carton) newErrors.carton = "انتخاب کارتن الزامی است";
      if (formData.repaired && !formData.description) newErrors.description = "توضیحات الزامی است";
      if (formData.type_product === "used" && !formData.grade) newErrors.grade = "درجه محصول الزامی است";
    } else if (step === 2) {
      if (!formData.price) newErrors.price = "قیمت همکار الزامی است";
      else if (!/^\d+$/.test(formData.price) || parseInt(formData.price) <= 0) newErrors.price = "قیمت باید عدد مثبت باشد";
      if (!formData.customer_price) newErrors.customer_price = "قیمت مشتری الزامی است";
      else if (!/^\d+$/.test(formData.customer_price) || parseInt(formData.customer_price) <= 0) {
        newErrors.customer_price = "قیمت مشتری باید عدد مثبت باشد";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => (s < (STEPS.length - 1) ? ((s + 1) as StepIndex) : s));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => (s > 0 ? ((s - 1) as StepIndex) : s));
  };

  const validateForm = () => {
    const newErrors: Partial<FormDataType> = {};
    if (!formData.type_product) newErrors.type_product = "انتخاب نوع محصول الزامی است" as any;
    if (!formData.model_mobile) newErrors.model_mobile = "انتخاب مدل موبایل الزامی است";
    if (!formData.color) newErrors.color = "انتخاب رنگ الزامی است";
    if (selectedModel?.is_apple) {
      if (!formData.battry_health) newErrors.battry_health = "سلامت باتری الزامی است";
      else if (!/^\d+$/.test(formData.battry_health) || parseInt(formData.battry_health) < 0 || parseInt(formData.battry_health) > 100) newErrors.battry_health = "سلامت باتری باید عددی بین 0 تا 100 باشد";
      if (!formData.part_num) newErrors.part_num = "پارت نامبر الزامی است";
    }
    if (!formData.guarantor) newErrors.guarantor = "ضمانت باقی‌مانده الزامی است";
    else if (!/^\d+$/.test(formData.guarantor) || parseInt(formData.guarantor) < 0) newErrors.guarantor = "ضمانت باید عدد غیرمنفی باشد";
    if (!formData.carton) newErrors.carton = "انتخاب کارتن الزامی است";
    if (formData.repaired && !formData.description) newErrors.description = "توضیحات الزامی است";
    if (formData.type_product === "used" && !formData.grade) newErrors.grade = "درجه محصول الزامی است";
    if (!formData.price) newErrors.price = "قیمت همکار الزامی است";
    else if (!/^\d+$/.test(formData.price) || parseInt(formData.price) <= 0) newErrors.price = "قیمت باید عدد مثبت باشد";
    if (!formData.customer_price) newErrors.customer_price = "قیمت مشتری الزامی است";
    else if (!/^\d+$/.test(formData.customer_price) || parseInt(formData.customer_price) <= 0) newErrors.customer_price = "قیمت مشتری باید عدد مثبت باشد";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      if (pictureIds.length === 0 && formData.pictures.length > 0) {
        toast.error("خطا در آپلود تصاویر");
        return;
      }

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
            description: "", description_appearance: "", technical_problem: "", price: "", customer_price: "",
            color: null, battry_health: "", battry_change: false, type_product: "new", auction: false,
            guarantor: "", repaired: false, part_num: "", status_product: "open", carton: "", grade: "",
            model_mobile: null, pictures: [],
        });
        setSelectedModel(null);
        setAvailableColors([]);
        setSearchTerm("");
        setShowDropdown(false);
        setErrors({});
        setCurrentStep(0);
      } else {
        toast.error("خطا در ایجاد محصول");
      }
    } catch (error) {
      console.error("خطا در ایجاد محصول:", error);
      toast.error("خطا در ایجاد محصول");
    }
  };

  return {
    formData, errors, currentStep, steps: STEPS,
    selectedModel, availableColors, searchTerm, showDropdown, showColorDropdown, colorSearch,
    filteredModels, filteredColors, isLoadingModels, isSubmitting: isPendingProduct || isPendingPicture,
    dropdownRef, colorDropdownRef, partNumbers,
    handleChange, handleModelSelect, handleColorSelect, handleSearchChange, 
    setSearchTerm, setShowDropdown, setShowColorDropdown, setColorSearch,
    handleNext, handleBack, handleSubmit
  };
};
