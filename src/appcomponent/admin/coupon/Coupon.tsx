// "use client";

// import { useState } from "react";
// import { Pencil, Trash2, Eye, Plus } from "lucide-react";
// import {
//   useGetCouponsQuery,
//   useCreateCouponMutation,
//   useUpdateCouponMutation,
//   useDeleteCouponMutation,
// } from "@/api/couponApi";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Breadcrumb } from "@/appcomponent/reusable";
// import { CouponPayload, Coupon } from "@/interfaces/api/Coupon";
// import { ProductResponse } from "@/interfaces/api/Product";
// import {
//   CategoryResponse,
//   useGetCategoryQuery,
//   useGetProductQuery,
// } from "@/api/productApi";
// import { toast } from "sonner";

// interface CouponFormData {
//   code: string;
//   description: string;
//   discount_type: "percentage" | "fixed";
//   discount_value: string;
//   active: boolean;
//   valid_from: string;
//   valid_to: string;
//   products: number[];
//   categories: number[];
// }

// const initialFormData: CouponFormData = {
//   code: "",
//   description: "",
//   discount_type: "percentage",
//   discount_value: "",
//   active: true,
//   valid_from: "",
//   valid_to: "",
//   products: [],
//   categories: [],
// };

// export const CouponTable = () => {
//   // Pass empty object or undefined as argument
//   const { data: couponsData, isLoading: couponsLoading } = useGetCouponsQuery({
//     page: 1,
//   });
//   const { data: productsData } = useGetProductQuery({ page: 1 });
//   const { data: categoriesData } = useGetCategoryQuery({});
//   const [createCoupon] = useCreateCouponMutation();
//   const [updateCoupon] = useUpdateCouponMutation();
//   const [deleteCoupon] = useDeleteCouponMutation();

//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
//   const [previewCoupon, setPreviewCoupon] = useState<Coupon | null>(null);
//   const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
//   const [formData, setFormData] = useState<CouponFormData>(initialFormData);
//   const [productSearch, setProductSearch] = useState("");
//   const [categorySearch, setCategorySearch] = useState("");

//   const coupons = couponsData?.results || [];
//   const products = productsData?.results || [];
//   const categories = categoriesData?.results || [];

//   // Update handleOpenForm to convert ISO to datetime-local format:

//   const handleOpenForm = (coupon?: Coupon) => {
//     if (coupon) {
//       setEditingCoupon(coupon);
//       setFormData({
//         code: coupon.code,
//         description: coupon.description || "",
//         discount_type: coupon.discount_type || "percentage",
//         discount_value: coupon.discount_value,
//         active: coupon.active,
//         // Convert ISO to datetime-local format (YYYY-MM-DDTHH:mm)
//         valid_from: coupon.valid_from.slice(0, 16), // "2025-10-24T00:00:00Z" -> "2025-10-24T00:00"
//         valid_to: coupon.valid_to.slice(0, 16), // "2025-12-31T23:59:59Z" -> "2025-12-31T23:59"
//         products: coupon.products || [],
//         categories: coupon.categories || [],
//       });
//     } else {
//       setEditingCoupon(null);
//       setFormData(initialFormData);
//     }
//     setIsFormOpen(true);
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//     setEditingCoupon(null);
//     setFormData(initialFormData);
//     setProductSearch("");
//     setCategorySearch("");
//   };

//   const handleSubmit = async () => {
//     try {
//       const payload: CouponPayload = {
//         code: formData.code,
//         description: formData.description,
//         discount_type: formData.discount_type,
//         discount_value: parseFloat(formData.discount_value),
//         active: formData.active,
//         valid_from: new Date(formData.valid_from).toISOString(), // Convert to ISO format
//         valid_to: new Date(formData.valid_to).toISOString(), // Convert to ISO format
//         products: formData.products,
//         categories: formData.categories,
//       };

//       if (editingCoupon) {
//         await updateCoupon({ id: editingCoupon.id, ...payload }).unwrap();
//         toast.success("Coupon updated successfully");
//       } else {
//         await createCoupon(payload).unwrap();
//         toast.success("Coupon created successfully");
//       }
//       handleCloseForm();
//     } catch (error) {
//       console.error("Error saving coupon:", error);
//     }
//   };
//   const handleDelete = async () => {
//     if (deletingCoupon) {
//       try {
//         await deleteCoupon(deletingCoupon.id).unwrap();
//         toast.success("Coupon deleted successfully");
//         setIsDeleteOpen(false);
//         setDeletingCoupon(null);
//       } catch (error) {
//         console.error("Error deleting coupon:", error);
//       }
//     }
//   };

//   const handlePreview = (coupon: Coupon) => {
//     setPreviewCoupon(coupon);
//     setIsPreviewOpen(true);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const truncateText = (text: string, lines: number) => {
//     if (!text) return "";
//     const words = text.split(" ");
//     if (words.length > 15 * lines) {
//       return words.slice(0, 15 * lines).join(" ") + "...";
//     }
//     return text;
//   };

//   const toggleProduct = (productId: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       products: prev.products.includes(productId)
//         ? prev.products.filter((id) => id !== productId)
//         : [...prev.products, productId],
//     }));
//   };

//   const toggleCategory = (categoryId: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       categories: prev.categories.includes(categoryId)
//         ? prev.categories.filter((id) => id !== categoryId)
//         : [...prev.categories, categoryId],
//     }));
//   };

//   const filteredProducts = products.filter((p: ProductResponse) =>
//     p.title.toLowerCase().includes(productSearch.toLowerCase())
//   );

//   const filteredCategories = categories.filter((c: CategoryResponse) =>
//     c.name.toLowerCase().includes(categorySearch.toLowerCase())
//   );

//   return (
//     <>
//       <Breadcrumb
//         title="Coupon"
//         subtitle="View and respond to Customer Message"
//       />
//       <div className="p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold text-white">
//             Coupons ({coupons.length})
//           </h2>
//           <Button onClick={() => handleOpenForm()}>
//             <Plus size={16} className="mr-2" />
//             Add Coupon
//           </Button>
//         </div>

//         {/* Table */}
//         <div className="border border-primary/20 rounded-lg overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow className="border-b border-primary/20 hover:bg-transparent">
//                 <TableHead className="text-white">Code</TableHead>
//                 <TableHead className="text-white">Type</TableHead>
//                 <TableHead className="text-white">Description</TableHead>
//                 <TableHead className="text-white">Valid From</TableHead>
//                 <TableHead className="text-white">Valid To</TableHead>
//                 <TableHead className="text-white">Active</TableHead>
//                 <TableHead className="text-white">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {couponsLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center text-white">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : coupons.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center text-white">
//                     No coupons found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 coupons.map((coupon: Coupon) => (
//                   <TableRow
//                     key={coupon.id}
//                     className="border-b border-primary/20 hover:bg-primary/5"
//                   >
//                     <TableCell className="font-medium text-white">
//                       {coupon.code}
//                     </TableCell>
//                     <TableCell className="text-white">
//                       {coupon.discount_type === "percentage"
//                         ? `${coupon.discount_value}%`
//                         : `$${coupon.discount_value}`}
//                     </TableCell>
//                     <TableCell className="text-white max-w-xs">
//                       {truncateText(coupon.description || "", 2)}
//                     </TableCell>
//                     <TableCell className="text-white">
//                       {formatDate(coupon.valid_from)}
//                     </TableCell>
//                     <TableCell className="text-white">
//                       {formatDate(coupon.valid_to)}
//                     </TableCell>
//                     <TableCell>
//                       <span
//                         className={`px-2 py-1 rounded text-xs ${
//                           coupon.active
//                             ? "bg-green-500/20 text-green-500"
//                             : "bg-red-500/20 text-red-500"
//                         }`}
//                       >
//                         {coupon.active ? "Active" : "Inactive"}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handlePreview(coupon)}
//                           className="p-1 hover:bg-primary/20 rounded text-white"
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleOpenForm(coupon)}
//                           className="p-1 hover:bg-primary/20 rounded text-white"
//                         >
//                           <Pencil size={16} />
//                         </button>
//                         <button
//                           onClick={() => {
//                             setDeletingCoupon(coupon);
//                             setIsDeleteOpen(true);
//                           }}
//                           className="p-1 hover:bg-red-500/20 rounded text-red-500"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Add/Edit Dialog */}
//         <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
//           <DialogContent className="bg-[#121212] border-primary/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="text-white">
//                 {editingCoupon ? "Edit Coupon" : "Add Coupon"}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <Label className="text-white">
//                   Coupon Code <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   value={formData.code}
//                   onChange={(e) =>
//                     setFormData({ ...formData, code: e.target.value })
//                   }
//                   placeholder="SAVE20"
//                   className="bg-[#1a1a1a] border-primary/20 text-white"
//                 />
//               </div>

//               <div>
//                 <Label className="text-white">Description</Label>
//                 <Textarea
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   placeholder="Enter coupon description"
//                   className="bg-[#1a1a1a] border-primary/20 text-white"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-white">
//                     Discount Type <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     value={formData.discount_type}
//                     onValueChange={(value: "percentage" | "fixed") =>
//                       setFormData({ ...formData, discount_type: value })
//                     }
//                   >
//                     <SelectTrigger className="bg-[#1a1a1a] border-primary/20 text-white">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-[#1a1a1a] border-primary/20">
//                       <SelectItem value="percentage" className="text-white">
//                         Percentage
//                       </SelectItem>
//                       <SelectItem value="fixed" className="text-white">
//                         Fixed Amount
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label className="text-white">
//                     Discount Value <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     type="number"
//                     value={formData.discount_value}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         discount_value: e.target.value,
//                       })
//                     }
//                     placeholder="10"
//                     className="bg-[#1a1a1a] border-primary/20 text-white"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-white">
//                     Valid From <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     type="datetime-local"
//                     value={formData.valid_from}
//                     onChange={(e) =>
//                       setFormData({ ...formData, valid_from: e.target.value })
//                     }
//                     className="bg-[#1a1a1a] border-primary/20 text-white"
//                   />
//                 </div>

//                 <div>
//                   <Label className="text-white">
//                     Valid To <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     type="datetime-local"
//                     value={formData.valid_to}
//                     onChange={(e) =>
//                       setFormData({ ...formData, valid_to: e.target.value })
//                     }
//                     className="bg-[#1a1a1a] border-primary/20 text-white"
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Switch
//                   checked={formData.active}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, active: checked })
//                   }
//                 />
//                 <Label className="text-white">Active</Label>
//               </div>

//               <div>
//                 <Label className="text-white">Products</Label>
//                 <Input
//                   placeholder="Search products..."
//                   value={productSearch}
//                   onChange={(e) => setProductSearch(e.target.value)}
//                   className="bg-[#1a1a1a] border-primary/20 text-white mb-2"
//                 />
//                 <div className="max-h-40 overflow-y-auto border border-primary/20 rounded p-2 bg-[#1a1a1a]">
//                   {filteredProducts.map((product: ProductResponse) => (
//                     <div
//                       key={product.id}
//                       className="flex items-center space-x-2 py-1 hover:bg-primary/10 px-2 rounded cursor-pointer"
//                       onClick={() => toggleProduct(product.id || 0)}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={formData.products.includes(product.id || 0)}
//                         onChange={() => toggleProduct(product.id || 0)}
//                         className="cursor-pointer"
//                       />
//                       <span className="text-white text-sm">
//                         {product.title}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <Label className="text-white">Categories</Label>
//                 <Input
//                   placeholder="Search categories..."
//                   value={categorySearch}
//                   onChange={(e) => setCategorySearch(e.target.value)}
//                   className="bg-[#1a1a1a] border-primary/20 text-white mb-2"
//                 />
//                 <div className="max-h-40 overflow-y-auto border border-primary/20 rounded p-2 bg-[#1a1a1a]">
//                   {filteredCategories.map((category: CategoryResponse) => (
//                     <div
//                       key={category.id}
//                       className="flex items-center space-x-2 py-1 hover:bg-primary/10 px-2 rounded cursor-pointer"
//                       onClick={() => toggleCategory(category.id)}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={formData.categories.includes(category.id)}
//                         onChange={() => toggleCategory(category.id)}
//                         className="cursor-pointer"
//                       />
//                       <span className="text-white text-sm">
//                         {category.name}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={handleCloseForm}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSubmit}>
//                 {editingCoupon ? "Update" : "Create"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Preview Dialog */}
//         <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
//           <DialogContent className="bg-[#121212] border-primary/20 text-white">
//             <DialogHeader>
//               <DialogTitle className="text-white">Coupon Details</DialogTitle>
//             </DialogHeader>
//             {previewCoupon && (
//               <div className="space-y-4">
//                 <div>
//                   <Label className="text-gray-400">Code</Label>
//                   <p className="text-white font-semibold">
//                     {previewCoupon.code}
//                   </p>
//                 </div>
//                 <div>
//                   <Label className="text-gray-400">Description</Label>
//                   <p className="text-white">
//                     {previewCoupon.description || "N/A"}
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label className="text-gray-400">Discount</Label>
//                     <p className="text-white">
//                       {previewCoupon.discount_type === "percentage"
//                         ? `${previewCoupon.discount_value}%`
//                         : `$${previewCoupon.discount_value}`}
//                     </p>
//                   </div>
//                   <div>
//                     <Label className="text-gray-400">Status</Label>
//                     <p
//                       className={
//                         previewCoupon.active ? "text-green-500" : "text-red-500"
//                       }
//                     >
//                       {previewCoupon.active ? "Active" : "Inactive"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label className="text-gray-400">Valid From</Label>
//                     <p className="text-white">
//                       {formatDate(previewCoupon.valid_from)}
//                     </p>
//                   </div>
//                   <div>
//                     <Label className="text-gray-400">Valid To</Label>
//                     <p className="text-white">
//                       {formatDate(previewCoupon.valid_to)}
//                     </p>
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="text-gray-400">Products</Label>
//                   <p className="text-white">
//                     {previewCoupon.products?.length || 0} product(s) selected
//                   </p>
//                 </div>
//                 <div>
//                   <Label className="text-gray-400">Categories</Label>
//                   <p className="text-white">
//                     {previewCoupon.categories?.length || 0} category(ies)
//                     selected
//                   </p>
//                 </div>
//               </div>
//             )}
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
//                 Close
//               </Button>
//               <Button
//                 onClick={() => {
//                   setIsPreviewOpen(false);
//                   handleOpenForm(previewCoupon as Coupon);
//                 }}
//               >
//                 Edit
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Delete Dialog */}
//         <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//           <DialogContent className="bg-[#121212] border-primary/20 text-white">
//             <DialogHeader>
//               <DialogTitle className="text-white">Delete Coupon</DialogTitle>
//               <DialogDescription className="text-gray-400">
//                 Are you sure you want to delete the coupon {'"'}
//                 {deletingCoupon?.code}
//                 {"'"}? This action cannot be undone.
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleDelete}
//                 className="bg-red-500 hover:bg-red-600"
//               >
//                 Delete
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </>
//   );
// };

"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "@/api/couponApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Breadcrumb } from "@/appcomponent/reusable";
import { CouponPayload, Coupon } from "@/interfaces/api/Coupon";
import { ProductResponse } from "@/interfaces/api/Product";
import {
  CategoryResponse,
  useGetCategoryQuery,
  useGetProductQuery,
} from "@/api/productApi";
import { toast } from "sonner";

interface CouponFormData {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  active: boolean;
  valid_from: string;
  valid_to: string;
  products: number[];
  categories: number[];
}

const initialFormData: CouponFormData = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  active: true,
  valid_from: "",
  valid_to: "",
  products: [],
  categories: [],
};

export const CouponTable = () => {
  // Visible table pagination for Coupons
  const [couponPage, setCouponPage] = useState(1);

  // Hidden pagination for Products & Categories
  const [productPage, setProductPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);

  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // Fetch Coupons
  const { data: couponsData, isLoading: couponsLoading } = useGetCouponsQuery({
    page: couponPage,
  });

  // Fetch Products (hidden pagination)
  const { data: productsData } = useGetProductQuery({
    page: productPage,
    search: productSearch,
  });

  // Fetch Categories (hidden pagination)
  const { data: categoriesData } = useGetCategoryQuery({
    page: categoryPage,
  });

  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [previewCoupon, setPreviewCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>(initialFormData);

  const coupons = couponsData?.results || [];
  const products = productsData?.results || [];
  const categories = categoriesData?.results || [];

  // Reset hidden pagination when search changes
  useEffect(() => setProductPage(1), [productSearch]);
  useEffect(() => setCategoryPage(1), [categorySearch]);

  const handleOpenForm = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description || "",
        discount_type: coupon.discount_type || "percentage",
        discount_value: coupon.discount_value,
        active: coupon.active,
        valid_from: coupon.valid_from.slice(0, 16),
        valid_to: coupon.valid_to.slice(0, 16),
        products: coupon.products || [],
        categories: coupon.categories || [],
      });
    } else {
      setEditingCoupon(null);
      setFormData(initialFormData);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCoupon(null);
    setFormData(initialFormData);
    setProductSearch("");
    setCategorySearch("");
  };

  const handleSubmit = async () => {
    try {
      const payload: CouponPayload = {
        code: formData.code,
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        active: formData.active,
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_to: new Date(formData.valid_to).toISOString(),
        products: formData.products,
        categories: formData.categories,
      };

      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon.id, ...payload }).unwrap();
        toast.success("Coupon updated successfully");
      } else {
        await createCoupon(payload).unwrap();
        toast.success("Coupon created successfully");
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast.error("Failed to save coupon");
    }
  };

  const handleDelete = async () => {
    if (!deletingCoupon) return;
    try {
      await deleteCoupon(deletingCoupon.id).unwrap();
      toast.success("Coupon deleted successfully");
      setIsDeleteOpen(false);
      setDeletingCoupon(null);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    }
  };

  const handlePreview = (coupon: Coupon) => {
    setPreviewCoupon(coupon);
    setIsPreviewOpen(true);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const truncateText = (text: string, lines: number) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > 15 * lines
      ? words.slice(0, 15 * lines).join(" ") + "..."
      : text;
  };

  const toggleProduct = (productId: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter((id) => id !== productId)
        : [...prev.products, productId],
    }));
  };

  const toggleCategory = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  return (
    <>
      <Breadcrumb title="Coupon" subtitle="View and manage coupons" />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Coupons ({couponsData?.count || 0})
          </h2>
          <Button onClick={() => handleOpenForm()}>
            <Plus size={16} className="mr-2" /> Add Coupon
          </Button>
        </div>

        {/* Coupons Table */}
        <div className="border border-primary/20 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-primary/20">
                <TableHead className="text-white">Code</TableHead>
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Description</TableHead>
                <TableHead className="text-white">Valid From</TableHead>
                <TableHead className="text-white">Valid To</TableHead>
                <TableHead className="text-white">Active</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {couponsLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-white">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-white">
                    No coupons found
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon: Coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="text-white">{coupon.code}</TableCell>
                    <TableCell className="text-white">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}%`
                        : `$${coupon.discount_value}`}
                    </TableCell>
                    <TableCell className="text-white max-w-xs">
                      {truncateText(coupon.description || "", 2)}
                    </TableCell>
                    <TableCell className="text-white">
                      {formatDate(coupon.valid_from)}
                    </TableCell>
                    <TableCell className="text-white">
                      {formatDate(coupon.valid_to)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          coupon.active
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {coupon.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button onClick={() => handlePreview(coupon)}>
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleOpenForm(coupon)}>
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingCoupon(coupon);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Coupons Pagination */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => setCouponPage((prev) => Math.max(prev - 1, 1))}
            disabled={couponPage === 1}
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          <Button
            onClick={() =>
              setCouponPage((prev) =>
                prev * 10 < (couponsData?.count || 0) ? prev + 1 : prev
              )
            }
            disabled={couponPage * 10 >= (couponsData?.count || 0)}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>

        {/* Add/Edit Coupon Dialog */}
        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent className="bg-[#121212] border-primary/20 text-white md:max-w-[80vw] max-h-[90vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? "Edit Coupon" : "Add Coupon"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Coupon Code *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="SAVE20"
                  className="bg-[#1a1a1a] border-primary/20 text-white"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter coupon description"
                  className="bg-[#1a1a1a] border-primary/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount Type *</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: "percentage" | "fixed") =>
                      setFormData({ ...formData, discount_type: value })
                    }
                  >
                    <SelectTrigger className="bg-[#1a1a1a] border-primary/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-primary/20">
                      <SelectItem value="percentage" className="text-white">
                        Percentage
                      </SelectItem>
                      <SelectItem value="fixed" className="text-white">
                        Fixed Amount
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Discount Value *</Label>
                  <Input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_value: e.target.value,
                      })
                    }
                    placeholder="10"
                    className="bg-[#1a1a1a] border-primary/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valid From *</Label>
                  <Input
                    type="datetime-local"
                    value={formData.valid_from}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_from: e.target.value })
                    }
                    className="bg-[#1a1a1a] border-primary/20 text-white"
                  />
                </div>
                <div>
                  <Label>Valid To *</Label>
                  <Input
                    type="datetime-local"
                    value={formData.valid_to}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_to: e.target.value })
                    }
                    className="bg-[#1a1a1a] border-primary/20 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
                />
                <Label>Active</Label>
              </div>

              {/* Products */}
              <div>
                <Label>Products</Label>
                <Input
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="bg-[#1a1a1a] border-primary/20 text-white mb-2"
                />
                <div className="max-h-40 overflow-y-auto border scrollbar-hide border-primary/20 rounded p-2 bg-[#1a1a1a]">
                  {products.map((product: ProductResponse) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-2 py-1 hover:bg-primary/10 px-2 rounded cursor-pointer"
                      onClick={() => toggleProduct(product.id || 0)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.products.includes(product.id || 0)}
                        onChange={() => toggleProduct(product.id || 0)}
                        className="cursor-pointer"
                      />
                      <span className="text-white text-sm">
                        {product.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <Label>Categories</Label>
                <div className="max-h-40 overflow-y-auto border border-primary/20 rounded p-2 bg-[#1a1a1a] scrollbar-hide">
                  {categories.map((category: CategoryResponse) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2 py-1 hover:bg-primary/10 px-2 rounded cursor-pointer"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="cursor-pointer"
                      />
                      <span className="text-white text-sm">
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingCoupon ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview and Delete Dialogs */}
        {/* ...Keep same as your original code (unchanged) */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="bg-[#121212] border-primary/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Coupon Details</DialogTitle>
            </DialogHeader>
            {previewCoupon && (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400">Code</Label>
                  <p className="text-white font-semibold">
                    {previewCoupon.code}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Description</Label>
                  <p className="text-white">
                    {previewCoupon.description || "N/A"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Discount</Label>
                    <p className="text-white">
                      {previewCoupon.discount_type === "percentage"
                        ? `${previewCoupon.discount_value}%`
                        : `$${previewCoupon.discount_value}`}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Status</Label>
                    <p
                      className={
                        previewCoupon.active ? "text-green-500" : "text-red-500"
                      }
                    >
                      {previewCoupon.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Valid From</Label>
                    <p className="text-white">
                      {formatDate(previewCoupon.valid_from)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Valid To</Label>
                    <p className="text-white">
                      {formatDate(previewCoupon.valid_to)}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-400">Products</Label>
                  <p className="text-white">
                    {previewCoupon.products?.length || 0} product(s) selected
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Categories</Label>
                  <p className="text-white">
                    {previewCoupon.categories?.length || 0} category(ies)
                    selected
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsPreviewOpen(false);
                  handleOpenForm(previewCoupon as Coupon);
                }}
              >
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="bg-[#121212] border-primary/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Coupon</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete the coupon {'"'}
                {deletingCoupon?.code}
                {"'"}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
