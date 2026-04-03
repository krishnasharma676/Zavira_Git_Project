import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const seedData = async (req: Request, res: Response) => {
  try {
    const categoryImages = [
      "https://plus.unsplash.com/premium_photo-1681276170423-2c60b95094b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amV3bGxlcnl8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    ];

    const productImages = [
      "https://plus.unsplash.com/premium_photo-1664879065881-a8a064ab8416?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amV3bGxlcnl8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80",
      "https://media.istockphoto.com/id/944588416/photo/beautiful-indian-young-women-portrait-with-indian-traditional-jewelry.webp?a=1&b=1&s=612x612&w=0&k=20&c=HgELFn2tcaN3nLTUiPI0_UgrmfzTZYLXsLnt2HBQYA4=",
    ];

    const colors = [
      { name: 'Rose Gold', code: '#B76E79' },
      { name: 'White Gold', code: '#E2E2E2' },
      { name: 'Yellow Gold', code: '#FFD700' }
    ];

    const jewelryCategories = [
      "Necklaces", "Earrings", "Bracelets", "Rings", 
      "Pendants", "Mangalsutras", "Bangles", "Anklets", 
      "Nose Pins", "Chains", "Bridal Sets", "Chokers", 
      "Hoops", "Studs", "Drop Earrings"
    ];

    const productPrefixes = ["Diamond", "Gold Plated", "Platinum", "Pearl", "Ruby", "Emerald", "Sapphire", "Silver", "Kundan", "Polki"];
    const productTypes = ["Choker", "Engagement Ring", "Drop Earrings", "Pendant Necklace", "Ankle Bracelet", "Bangle Set", "Stud Earrings", "Mangalsutra", "Hoop Earrings", "Chain"];
    const productAdjectives = ["Elegant", "Vintage", "Modern", "Classic", "Delicate", "Statement", "Bridal", "Minimalist", "Royal", "Timeless"];
    
    for (let c = 0; c < 15; c++) {
      const catBaseName = jewelryCategories[c] || `Collection ${c+1}`;
      const categoryName = `${catBaseName} - ${Date.now().toString().slice(-4)}`;
      const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const catImg = categoryImages[c % categoryImages.length];
      
      const category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categorySlug,
          description: `Exquisite ${catBaseName.toLowerCase()} crafted for the modern woman who appreciates luxury.`,
          imageUrl: catImg,
          isActive: true
        }
      });

      // 30 products per category
      for (let p = 1; p <= 30; p++) {
        const prefix = productPrefixes[Math.floor(Math.random() * productPrefixes.length)];
        const type = productTypes[Math.floor(Math.random() * productTypes.length)];
        const adjective = productAdjectives[Math.floor(Math.random() * productAdjectives.length)];
        
        const isBulk = p <= 10; // First 10 are bulk products
        
        let productName = `${adjective} ${prefix} ${type} - ${Date.now().toString().slice(-4)}`;
        if (isBulk) {
          productName = `[BULK] ${productName}`;
        }
        
        const productSlug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const price = Math.floor(Math.random() * 25000) + 2500;
        
        const mainImg = productImages[Math.floor(Math.random() * productImages.length)];
        const hoverImg = productImages[Math.floor(Math.random() * productImages.length)];
        
        const isHotDeal = p % 4 === 0;
        const isTrending = p % 3 === 0;

        await prisma.product.create({
          data: {
            name: productName,
            slug: productSlug,
            description: `Enhance your grace with this ${adjective.toLowerCase()} ${prefix.toLowerCase()} piece. Handcrafted perfectly for any special occasion.`,
            basePrice: price,
            discountedPrice: price > 15000 ? price - 2000 : null,
            categoryId: category.id,
            featured: p === 1 || p === 2,
            hotDeals: isHotDeal,
            trending: isTrending,
            
            attributes: isBulk ? { isVariantProduct: true } : {},

            inventory: {
              create: {
                stock: isBulk ? 150 : 75,
                sku: `ZAV-${c+1}-${p}-${Date.now().toString().slice(-4)}`
              }
            },
            
            images: {
              create: [
                { imageUrl: mainImg, cloudinaryPublicId: `demo_main_${c+1}_${p}`, isPrimary: true },
                { imageUrl: hoverImg, cloudinaryPublicId: `demo_hover_${c+1}_${p}`, isPrimary: false }
              ]
            },

            ...(isBulk && {
              variants: {
                create: colors.map((col, cIdx) => ({
                  color: col.name,
                  colorCode: col.code,
                  sku: `VAR-${c+1}-${p}-${col.name.substring(0,3).toUpperCase()}`,
                  stock: 50,
                  sizes: {
                    create: [
                      { size: "One Size", stock: 25, sku: `SZ-${c+1}-${p}-${cIdx}-1` },
                      { size: "Adjustable", stock: 25, sku: `SZ-${c+1}-${p}-${cIdx}-2` }
                    ]
                  },
                  images: {
                    create: [
                      { imageUrl: productImages[(p + cIdx) % productImages.length], cloudinaryPublicId: `v_img_1_${c+1}_${p}`, isPrimary: true },
                      { imageUrl: productImages[(p + cIdx + 1) % productImages.length], cloudinaryPublicId: `v_img_2_${c+1}_${p}`, isPrimary: false }
                    ]
                  }
                }))
              }
            })
          }
        });
      }
    }
    
    res.status(200).json({ success: true, message: "Successfully seeded women's jewelry demo data with 450 products." });
  } catch (error: any) {
    console.error("Seeding error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to seed data" });
  }
};
