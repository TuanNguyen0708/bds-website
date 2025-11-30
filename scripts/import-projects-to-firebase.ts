import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBx_ttb1Iwuk3FuGWLz2K4n6MjjSHt_Mn8",
  authDomain: "bds-website-11dc4.firebaseapp.com",
  projectId: "bds-website-11dc4",
  storageBucket: "bds-website-11dc4.firebasestorage.app",
  messagingSenderId: "346152437288",
  appId: "1:346152437288:web:e6b67947dfedf927f1171d",
  measurementId: "G-59TE4948JL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface ProjectInfo {
  projectName: string;
  slogan: string;
  summary: string;
  location: {
    address: string;
    region: string;
    city: string;
    district: string;
    coordinates: string;
    surrounding: string;
  };
  overview: {
    description: string;
    highlights: string[];
  };
  investor: string;
  developers: string[];
  contractors: string[];
  legalStatus: string;
  ownership: string;
  handoverTime: string;
  constructionStart: string;
  constructionProgress: string;
  scale: {
    totalLandArea: string;
    constructionArea: string;
    floorArea: string;
    buildingDensity: string;
    numberOfBlocks: string;
    numberOfFloors: string;
    numberOfUnits: string;
    greenArea: string;
    parking: string;
  };
  design: {
    architectureStyle: string;
    interior: string;
    floorPlans: string;
    unitTypes: Array<{
      type: string;
      area: string;
      bedrooms: string;
      bathrooms: string;
      description: string;
    }>;
  };
  amenities: {
    internal: string[];
    external: string[];
  };
  pricing: {
    startingPrice: string;
    priceRange: string;
    pricePerSqm: string;
    paymentPolicy: string;
    promotion: string;
    maintenanceFee: string;
    managementFee: string;
  };
  policies: {
    salesPolicy: string;
    bankSupport: string;
    loanSupport: string;
    interestRatePolicy: string;
  };
  gallery: {
    images: string[];
    videos: string[];
  };
  attachments: string[];
}

async function importProjects() {
  try {
    console.log('🚀 Bắt đầu import dự án vào Firebase...\n');
    
    // Read JSON file
    const jsonPath = path.join(__dirname, '..', 'assets', 'projects.json');
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    
    // Remove BOM if present
    const cleanContent = fileContent.charCodeAt(0) === 0xFEFF 
      ? fileContent.slice(1) 
      : fileContent;
    
    const projects: ProjectInfo[] = JSON.parse(cleanContent);
    
    console.log(`📁 Đã đọc ${projects.length} dự án từ file JSON\n`);
    
    // Check if projects already exist
    const existingProjects = await getDocs(collection(db, 'projects'));
    const existingCount = existingProjects.size;
    
    if (existingCount > 0) {
      console.log(`⚠️  Đã có ${existingCount} dự án trong Firebase.`);
      console.log('   Bạn có muốn tiếp tục? (Các dự án mới sẽ được thêm, không ghi đè)\n');
    }
    
    // Import projects
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      
      try {
        // Check if project already exists by projectName
        const existingQuery = query(
          collection(db, 'projects'),
          where('projectName', '==', project.projectName)
        );
        const existingDocs = await getDocs(existingQuery);
        
        if (!existingDocs.empty) {
          console.log(`⏭️  Đã bỏ qua: "${project.projectName}" (đã tồn tại)`);
          continue;
        }
        
        // Add project to Firebase
        await addDoc(collection(db, 'projects'), {
          ...project,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        successCount++;
        console.log(`✅ [${i + 1}/${projects.length}] Đã import: "${project.projectName}"`);
      } catch (error) {
        errorCount++;
        console.error(`❌ [${i + 1}/${projects.length}] Lỗi khi import "${project.projectName}":`, error);
      }
    }
    
    console.log('\n📊 Kết quả:');
    console.log(`   ✅ Thành công: ${successCount} dự án`);
    console.log(`   ❌ Lỗi: ${errorCount} dự án`);
    console.log(`   ⏭️  Đã bỏ qua: ${projects.length - successCount - errorCount} dự án (đã tồn tại)`);
    console.log('\n✨ Hoàn thành import dữ liệu!');
    
  } catch (error) {
    console.error('❌ Lỗi khi import dữ liệu:', error);
    process.exit(1);
  }
}

// Run import
importProjects()
  .then(() => {
    console.log('\n🎉 Import hoàn tất!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  });

