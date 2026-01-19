import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Plus,
    ShoppingBag,
    Trash2,
    ExternalLink,
    Loader2,
    Save,
    Sparkles,
    Search,
    ChevronRight,
    Camera,
    Edit3
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/ui/DeleteDialog";
import { useTitle } from "@/hooks/useTitle";

const Marketplace = () => {
    useTitle("Store");
    const { data, isLoading } = useDashboard();
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [url, setUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const resetForm = () => {
        setTitle("");
        setPrice("");
        setUrl("");
        setImageUrl("");
        setEditId(null);
        setIsAdding(false);
    };

    const handleSubmitItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            if (editId) {
                const { error } = await supabase.from("curated_products")
                    .update({
                        title,
                        price,
                        url,
                        image_url: imageUrl
                    })
                    .eq("id", editId);
                if (error) throw error;
                toast.success("Product Updated.");
            } else {
                const { error } = await supabase.from("curated_products").insert([
                    {
                        profile_id: user.id,
                        title,
                        price,
                        url,
                        image_url: imageUrl,
                        order_index: data?.products.length || 0
                    }
                ]);
                if (error) throw error;
                toast.success("Product Added.");
            }

            resetForm();
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: any) => {
        setTitle(product.title);
        setPrice(product.price || "");
        setUrl(product.url);
        setImageUrl(product.image_url || "");
        setEditId(product.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const { error } = await supabase.from("curated_products").delete().eq("id", deleteId);
            if (error) throw error;
            toast.success("Product Removed.");
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            setDeleteId(null);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-luxury-gold" size={48} />
                <p className="text-white/20 font-syncopate uppercase tracking-[0.5em] text-[10px]">Loading Store...</p>
            </div>
        );
    }

    return (
        <div className="space-y-16 py-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-white/5 relative">
                <div className="absolute top-0 left-0 w-96 h-96 bg-luxury-gold/5 blur-[120px] -ml-48 -mt-48 pointer-events-none" />

                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-luxury-gold w-5 h-5 opacity-50" />
                        <span className="text-[10px] font-syncopate uppercase tracking-[0.4em] text-luxury-gold opacity-60">Products</span>
                    </div>
                    <h1 className="text-6xl font-syncopate font-bold uppercase tracking-tighter leading-none">Store</h1>
                    <p className="text-white/30 font-plus text-xl mt-6 max-w-2xl leading-relaxed">
                        Curate and manage your high-end products and recommendations.
                    </p>
                </div>

                {!isAdding && (
                    <Button variant="luxury" onClick={() => setIsAdding(true)} className="gap-3 px-10 py-6 rounded-[2rem] shadow-[0_0_30px_rgba(212,175,55,0.2)] text-sm tracking-widest font-syncopate uppercase">
                        <Plus size={20} /> Add Product
                    </Button>
                )}
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    >
                        <Card className="p-12 border-luxury-gold/20 bg-luxury-gold/[0.02] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 blur-[100px] -mr-32 -mt-32" />

                            <form onSubmit={handleSubmitItem} className="relative space-y-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-luxury-gold/10 rounded-[2rem] flex items-center justify-center text-luxury-gold">
                                        <ShoppingBag size={24} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-syncopate font-bold uppercase tracking-tight text-white">
                                            {editId ? "Edit Product" : "Add Product"}
                                        </h2>
                                        <p className="text-xs text-white/20 font-syncopate uppercase tracking-widest mt-1">
                                            {editId ? "Update Product Details" : "Enter Product Details"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">Product Name</label>
                                            <input
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Ex. Mechanical Keyboard"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 px-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.05] transition-all duration-500 font-plus text-lg text-white font-medium"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">Price</label>
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-luxury-gold/40 font-syncopate font-bold text-lg pointer-events-none">
                                                    {data?.profile?.currency === 'INR' ? '₹' :
                                                        data?.profile?.currency === 'EUR' ? '€' :
                                                            data?.profile?.currency === 'GBP' ? '£' :
                                                                data?.profile?.currency === 'JPY' ? '¥' :
                                                                    data?.profile?.currency === 'AED' ? 'د.إ' : '$'}
                                                </div>
                                                <input
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    placeholder="999.00"
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.05] transition-all duration-500 font-plus text-lg text-white font-medium shadow-2xl"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">Product URL</label>
                                            <input
                                                required
                                                type="url"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                placeholder="https://shop.com/product"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 px-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.05] transition-all duration-500 font-plus text-lg text-white"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-syncopate uppercase tracking-[0.3em] text-white/40 ml-2">Image URL</label>
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    placeholder="https://images.com/product.jpg"
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 px-8 outline-none focus:border-luxury-gold/40 focus:bg-white/[0.05] transition-all duration-500 font-plus text-lg text-white"
                                                />
                                                <Camera className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10" size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
                                    <Button type="button" variant="ghost" className="px-10 h-16 text-xs font-syncopate uppercase tracking-widest" onClick={resetForm}>Cancel</Button>
                                    <Button type="submit" variant="luxury" disabled={loading} className="px-12 h-16 rounded-[2rem] gap-3 text-sm font-syncopate uppercase tracking-widest shadow-2xl">
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        {editId ? "Save Changes" : "Add Product"}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {data?.products.length === 0 && !isAdding ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-3 text-center py-32 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/10 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-10 border border-white/5 group-hover:border-luxury-gold/20 ">
                                <Search size={40} className="text-white/5 group-hover:text-luxury-gold group-hover:scale-110 " strokeWidth={1} />
                            </div>
                            <h3 className="text-2xl font-syncopate font-bold text-white/40 mb-4 uppercase tracking-tighter">No Products Found</h3>
                            <p className="text-white/20 font-plus text-lg mb-10 max-w-sm mx-auto uppercase tracking-widest text-[10px]">Your store is currently empty.</p>

                        </div>
                    </motion.div>
                ) : (
                    data?.products.map((product: any, idx: number) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="group hover:border-luxury-gold/30 p-0 overflow-hidden flex flex-col bg-white/[0.01] border-white/5 ">
                                <div className="aspect-[4/3] bg-white/[0.02] relative overflow-hidden">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 mix-blend-luminosity hover:mix-blend-normal" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                                            <ShoppingBag size={80} strokeWidth={0.5} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                    <div className="absolute top-6 right-6 flex gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-10 h-10 p-0 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-luxury-gold/40 hover:text-luxury-gold transition-all duration-500"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <Edit3 size={16} className="text-white/40 group-hover:text-luxury-gold" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-10 h-10 p-0 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-500"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <Trash2 size={16} className="text-white/40 group-hover:text-red-500" />
                                        </Button>
                                    </div>

                                    <div className="absolute bottom-6 left-6">
                                        <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-luxury-gold/20 rounded-full flex items-center gap-2">
                                            <Sparkles size={10} className="text-luxury-gold" />
                                            <span className="text-[9px] font-syncopate uppercase tracking-widest text-luxury-gold">Featured</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-10 flex-1 flex flex-col justify-between relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-gold/5 blur-[50px] -mr-12 -mt-12 group-hover:bg-luxury-gold/10 transition-colors" />

                                    <div className="relative">
                                        <div className="flex justify-between items-start gap-4 mb-3">
                                            <h3 className="text-2xl font-plus font-bold uppercase tracking-tight text-white group-hover:text-luxury-gold transition-colors duration-500 line-clamp-1">{product.title}</h3>
                                        </div>
                                        <p className="text-[10px] text-white/20 font-syncopate uppercase tracking-[0.3em] font-medium mb-8 group-hover:text-white/40 transition-colors">
                                            {new URL(product.url).hostname.replace('www.', '')}
                                        </p>

                                        <div className="flex items-end justify-between mb-10">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-syncopate text-white/10 uppercase tracking-[0.2em] mb-1">Price</span>
                                                <span className="text-3xl font-syncopate font-bold text-white tracking-tighter">
                                                    {data?.profile?.currency === "INR" ? "₹" : data?.profile?.currency === "EUR" ? "€" : data?.profile?.currency === "GBP" ? "£" : data?.profile?.currency === "JPY" ? "¥" : data?.profile?.currency === "AED" ? "د.إ" : "$"}{product.price || "0.00"}
                                                </span>
                                            </div>
                                            <ChevronRight size={24} className="text-white/5 group-hover:text-luxury-gold/20 group-hover:translate-x-2 " />
                                        </div>
                                    </div>

                                    <a href={product.url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="w-full py-6 rounded-[2rem] gap-3 group/btn border-white/5 hover:border-luxury-gold/40 hover:bg-luxury-gold/[0.02] text-xs font-syncopate uppercase tracking-widest">
                                            <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-500" />
                                            View Product
                                        </Button>
                                    </a>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
            <DeleteDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                isDeleting={deleting}
                title="Remove Product"
                description="This will permanently remove this product from your store."
            />
        </div>
    );
};

export default Marketplace;
