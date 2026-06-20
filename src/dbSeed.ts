import { collection, getDocs, writeBatch, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Restaurant, MenuItem } from "./types";

// @ts-ignore
//import schoolLunchBento from "./assets/images/taiwan_railway_bento_1781950697611.jpg";

export const SEED_RESTAURANTS: Restaurant[] = [
  {
    id: "rest_beef_noodles",
    name: "大安牛肉麵王 (Daan Beef Noodle King)",
    description: "三十年經典老店，精心熬製大骨高湯，黃金比例半筋半肉川味紅燒與清燉牛肉麵。",
    cuisine: "台灣傳統小吃",
    address: "臺北市大安區和平東路二段118巷20號",
    phone: "02-2735-8888",
    imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    isActive: true,
    ownerId: "owner_rest_beef"
  },
  {
    id: "rest_bubble_tea",
    name: "大安壹號茶飲 (Daan Tea Studio)",
    description: "自產自銷手採高山茶，搭配特調Q彈珍珠、手作鮮奶布丁與香濃烤布蕾黑糖系列。",
    cuisine: "手搖飲品/甜點",
    address: "臺北市大安區復興南路二段150號",
    phone: "02-2701-1122",
    imageUrl: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    isActive: true,
    ownerId: "owner_rest_tea"
  },
  {
    id: "rest_bento",
    name: "和平手作木盒精緻便當 (Heping Bento Studio)",
    description: "大安區學生最愛！每日嚴選主菜如香酥大雞腿、獨門滷排骨與照燒鹽烤鮭魚便當。",
    cuisine: "美味精緻便當",
    address: "臺北市大安區和平東路二段96巷3-1號",
    phone: "02-2736-5566",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
    rating: 4.5,
    isActive: true,
    ownerId: "owner_rest_bento"
  },
  {
    id: "rest_burger",
    name: "科技大樓美式漢堡 (Tech Hub Burgers)",
    description: "手打100%純牛肉排爆汁美味，搭配秘製美式漢堡醬與現炸黃金脆薯，深受工程師喜愛。",
    cuisine: "美式漢堡餐點",
    address: "臺北市大安區復興南路二段340巷5號",
    phone: "02-2733-1212",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    isActive: true,
    ownerId: "owner_rest_burger"
  },
  {
    id: "rest_school_lunch",
    name: "國立臺北教育大學附設實驗國民小學營養午餐",
    description: "專為國北教大實小學童設計的每日營養均衡、安全健康鮮美午餐！週一至週五餐餐精心調配，符合國家各項兒童營養標準。歡迎教師、師生與家長點選查看每日精美營養菜色。",
    cuisine: "學校營養午餐",
    address: "臺北市大安區和平東路二段94號 (國北教大實小廚房)",
    phone: "02-2735-6115",
    imageUrl: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    isActive: true,
    ownerId: "owner_school_lunch"
  }
];

export const SEED_MENU_ITEMS: { [key: string]: MenuItem[] } = {
  rest_school_lunch: [
    {
      id: "menu_lunch_mon",
      name: "星期一精選：茄汁雞肉營養午餐",
      description: "主食-糙米飯、主菜-茄汁雞肉、副菜-菜脯炒蛋、蔬菜-有機小白菜、湯品-榨菜肉絲湯",
      price: 75,
      category: "星期一 (Monday)",
      imageUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f0b?auto=format&fit=crop&q=80&w=400",
      isAvailable: true,
      restaurantId: "rest_school_lunch"
    },
    {
      id: "menu_lunch_tue",
      name: "星期二精選：咖哩豬肉營養午餐",
      description: "主食-有機白米飯、主菜-咖哩豬肉、副菜-玉米餅、蔬菜-有機黑木耳小松菜、湯品-綠豆麥片、附餐-小番茄",
      price: 75,
      category: "星期二 (Tuesday)",
      imageUrl: "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=400",
      isAvailable: true,
      restaurantId: "rest_school_lunch"
    },
    {
      id: "menu_lunch_wed",
      name: "星期三精選：糖醋魚營養午餐",
      description: "主食-白米飯、主菜-糖醋魚、副菜-鐵板燒豬、蔬菜-油菜、湯品-海芽蔬菜湯",
      price: 75,
      category: "星期三 (Wednesday)",
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400",
      isAvailable: true,
      restaurantId: "rest_school_lunch"
    },
    {
      id: "menu_lunch_thu",
      name: "星期四精選：鹽燒豬肉營養午餐",
      description: "主食-海苔飯、主菜-鹽燒豬肉、副菜-雞絲高麗、蔬菜-有機青江菜、湯品-玉米蔬菜湯",
      price: 75,
      category: "星期四 (Thursday)",
      imageUrl: "https://images.unsplash.com/photo-1602404077122-2940b362ad03?auto=format&fit=crop&q=80&w=400",
      isAvailable: true,
      restaurantId: "rest_school_lunch"
    },
    {
      id: "menu_lunch_fri",
      name: "星期五精選：香滷雞腿營養午餐",
      description: "主食-玉米炒飯、主菜-香滷雞腿、副菜-珍菇炒蛋、蔬菜-小白菜、湯品-好彩頭雞湯",
      price: 75,
      category: "星期五 (Friday)",
      imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=400",
      isAvailable: true,
      restaurantId: "rest_school_lunch"
    }
  ],
  rest_beef_noodles: [
    {
      id: "menu_beef_1",
      name: "招牌川味半筋半肉牛肉麵",
      description: "精選澳洲牛腱與彈牙牛筋，招牌紅燒中藥湯頭，口感濃郁有層次。",
      price: 220,
      category: "熱銷麵食",
      imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_beef_noodles"
    },
    {
      id: "menu_beef_2",
      name: "清燉鮮美牛腱細粉",
      description: "清爽骨香高湯底，清甜蘿蔔燉煮，牛腱片入口即化，低卡健康新選擇。",
      price: 190,
      category: "熱銷麵食",
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_beef_noodles"
    },
    {
      id: "menu_beef_3",
      name: "家傳經典黃金滷肉飯 (大)",
      description: "肥瘦黃金比例肥而不膩，紅蔥香氣撲鼻，附特製滷鴨蛋與香脆醃漬小黃瓜。",
      price: 65,
      category: "台灣小吃",
      imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_beef_noodles"
    },
    {
      id: "menu_beef_4",
      name: "秘製麻辣牛肚 & 川味豆干金牌滷味雙拼",
      description: "老糖色中藥滷汁，爽口Q彈，一口接一口停不下來的招牌涼拌拼盤。",
      price: 90,
      category: "經典小菜",
      imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_beef_noodles"
    }
  ],
  rest_bubble_tea: [
    {
      id: "menu_tea_1",
      name: "波霸黑糖厚鮮奶茶",
      description: "手熬柴燒黑糖，鮮乳坊純鮮乳與斯里蘭卡紅茶的完美結合，手作每日波霸。",
      price: 75,
      category: "黑糖鮮奶系列",
      imageUrl: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_bubble_tea"
    },
    {
      id: "menu_tea_2",
      name: "黃金高山烏龍原茶 (大)",
      description: "特選杉林溪烏龍，無糖去冰，喉韻甘甜清香，去油解膩之首選佳品。",
      price: 45,
      category: "醇厚原茶",
      imageUrl: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_bubble_tea"
    },
    {
      id: "menu_tea_3",
      name: "手作烤布蕾奶蓋紅茶",
      description: "炙燒糖霜奶蓋，香濃綿密布丁風味，下午茶與宵夜的幸福滋味。",
      price: 80,
      category: "法式奶蓋系列",
      imageUrl: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_bubble_tea"
    }
  ],
  rest_bento: [
    {
      id: "menu_bento_1",
      name: "炸大雞腿佐手作木盒飯盒",
      description: "外酥內多汁酥炸大雞腿，搭配精選三款精緻配菜與台梗九號米飯，飽足感十足。",
      price: 130,
      category: "木盒便當",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_bento"
    },
    {
      id: "menu_bento_2",
      name: "古早味獨門醬滷排骨飯盒",
      description: "先炸後滷古早風味，油黑光亮且軟嫩彈牙，是老饕們心中不可或缺的老味道。",
      price: 115,
      category: "木盒便當",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_bento"
    },
    {
      id: "menu_bento_3",
      name: "照燒鹽烤北歐鮭魚排便當",
      description: "富含滿滿DHA與優質蛋白質，鹽烤保留油脂鮮甜，配特製日式沾醬。",
      price: 155,
      category: "海鮮便當",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_bento"
    }
  ],
  rest_burger: [
    {
      id: "menu_burger_1",
      name: "熔岩起司松露純牛堡套餐",
      description: "雙層切達起司、義大利黑松露美乃滋、厚切牛肉排、現炸脆口金黃薯條與大汽水。",
      price: 240,
      category: "招牌主打餐",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_burger"
    },
    {
      id: "menu_burger_2",
      name: "酥脆黃金咔啦雞腿堡套餐",
      description: "獨特香料醃製微辣炸雞，厚脆金黃外衣配新鮮萵苣、番茄，酸甜凱薩醬佐脆薯薯條。",
      price: 195,
      category: "美式漢堡套餐",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_burger"
    },
    {
      id: "menu_burger_3",
      name: "美式水牛城辣味炸雞桶",
      description: "秘製水牛城酸辣紅醬，金黃酥脆鮮美多汁炸雞4塊裝，美味停不了！",
      price: 180,
      category: "爽口單點",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300",
      isAvailable: true,
      restaurantId: "rest_burger"
    }
  ]
};

export async function seedDatabaseIfEmpty(): Promise<boolean> {
  try {
    const restCol = collection(db, "restaurants");
    const snapshot = await getDocs(restCol);
    
    let needsSeeding = snapshot.empty;
    let schoolLunchMissing = false;

    if (!snapshot.empty) {
      // Check if school lunch itself is missing or outdated in the DB
      const schoolLunchSnap = snapshot.docs.find((d) => d.id === "rest_school_lunch");
      if (!schoolLunchSnap) {
        schoolLunchMissing = true;
      } else {
        const latestSchoolLunch = SEED_RESTAURANTS.find((r) => r.id === "rest_school_lunch");
        if (latestSchoolLunch) {
          console.log("Ensuring latest school lunch restaurant info in Firestore...");
          await setDoc(doc(db, "restaurants", "rest_school_lunch"), latestSchoolLunch);
        }
      }
    }

    if (needsSeeding) {
      console.log("Seeding initial database restaurants and menus...");
      const batch = writeBatch(db);

      // Set restaurants and their menu items subcollection
      for (const rest of SEED_RESTAURANTS) {
        const restDocRef = doc(db, "restaurants", rest.id);
        batch.set(restDocRef, rest);

        const items = SEED_MENU_ITEMS[rest.id];
        if (items) {
          for (const item of items) {
            const menuItemRef = doc(db, "restaurants", rest.id, "menuItems", item.id);
            batch.set(menuItemRef, item);
          }
        }
      }

      await batch.commit();
      console.log("Database seeded successfully!");
      return true;
    } else if (schoolLunchMissing) {
      console.log("Seeding school lunch restaurant and weekly menus specifically...");
      const batch = writeBatch(db);
      
      const rest = SEED_RESTAURANTS.find((r) => r.id === "rest_school_lunch");
      if (rest) {
        const restDocRef = doc(db, "restaurants", rest.id);
        batch.set(restDocRef, rest);

        const items = SEED_MENU_ITEMS[rest.id];
        if (items) {
          for (const item of items) {
            const menuItemRef = doc(db, "restaurants", rest.id, "menuItems", item.id);
            batch.set(menuItemRef, item);
          }
        }
        await batch.commit();
        console.log("School lunch features self-healed successfully in Firestore!");
        return true;
      }
    }

    console.log("Database has already been seeded with restaurants and menu items.");
    return false;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
}
