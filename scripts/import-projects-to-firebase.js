const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

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

async function importProjects() {
  try {
    console.log('🚀 Bắt đầu import dự án vào Firebase...\n');
    
    // Read JSON file
    const jsonPath = path.join(__dirname, '..', 'assets', 'projects.json');
    let fileContent = fs.readFileSync(jsonPath, 'utf-8');
    
    // Remove BOM if present
    if (fileContent.charCodeAt(0) === 0xFEFF) {
      fileContent = fileContent.slice(1);
    }
    
    const projects = JSON.parse(fileContent);
    
    console.log(`📁 Đã đọc ${projects.length} dự án từ file JSON\n`);
    
    // Check if projects already exist
    const existingProjects = await getDocs(collection(db, 'projects'));
    const existingCount = existingProjects.size;
    
    if (existingCount > 0) {
      console.log(`⚠️  Đã có ${existingCount} dự án trong Firebase.`);
      console.log('   Các dự án mới sẽ được thêm, không ghi đè dự án đã tồn tại.\n');
    }
    
    // Import projects
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
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
          skippedCount++;
          console.log(`⏭️  [${i + 1}/${projects.length}] Đã bỏ qua: "${project.projectName}" (đã tồn tại)`);
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
        console.error(`❌ [${i + 1}/${projects.length}] Lỗi khi import "${project.projectName}":`, error.message || error);
      }
    }
    
    console.log('\n📊 Kết quả:');
    console.log(`   ✅ Thành công: ${successCount} dự án`);
    console.log(`   ❌ Lỗi: ${errorCount} dự án`);
    console.log(`   ⏭️  Đã bỏ qua: ${skippedCount} dự án (đã tồn tại)`);
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

