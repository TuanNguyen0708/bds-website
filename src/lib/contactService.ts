import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt?: unknown;
}

export interface ContactData extends ContactFormData {
  id: string;
  createdAt: unknown;
}

export interface FilterOptions {
  name?: string;
  service?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export const submitContactForm = async (formData: ContactFormData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...formData,
      createdAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw new Error('Không thể gửi form liên hệ. Vui lòng thử lại sau.');
  }
};

export const getContacts = async (
  filterOptions: FilterOptions = {},
  paginationOptions: PaginationOptions = { page: 1, pageSize: 10 }
): Promise<{ contacts: ContactData[]; total: number; hasMore: boolean }> => {
  try {
    // Query đơn giản nhất: chỉ orderBy và limit
    const q = query(
      collection(db, 'contacts'), 
      orderBy('createdAt', 'desc'),
      limit(paginationOptions.pageSize)
    );
    
    // Lấy tất cả documents để tính total
    const allDocsQuery = query(collection(db, 'contacts'));
    const totalSnapshot = await getDocs(allDocsQuery);
    const total = totalSnapshot.size;
    
    // Lấy documents theo pagination
    const querySnapshot = await getDocs(q);
    const contacts: ContactData[] = [];
    
    querySnapshot.forEach((doc) => {
      contacts.push({
        id: doc.id,
        ...doc.data(),
      } as ContactData);
    });
    
    // Lọc dữ liệu ở client-side để tránh cần index
    let filteredContacts = contacts;
    
    // Filter theo service
    if (filterOptions.service && filterOptions.service !== 'all') {
      filteredContacts = filteredContacts.filter(contact => 
        contact.service === filterOptions.service
      );
    }
    
    // Filter theo name (client-side search)
    if (filterOptions.name && filterOptions.name.trim()) {
      const searchTerm = filterOptions.name.trim().toLowerCase();
      filteredContacts = filteredContacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter theo date range (client-side)
    if (filterOptions.startDate || filterOptions.endDate) {
      filteredContacts = filteredContacts.filter(contact => {
        if (!contact.createdAt) return false;
        
        let contactDate: Date;
        if (typeof contact.createdAt === 'object' && 'toDate' in contact.createdAt) {
          contactDate = (contact.createdAt as { toDate: () => Date }).toDate();
        } else if (contact.createdAt instanceof Date) {
          contactDate = contact.createdAt;
        } else {
          return false;
        }
        
        if (filterOptions.startDate && contactDate < filterOptions.startDate) {
          return false;
        }
        
        if (filterOptions.endDate && contactDate > filterOptions.endDate) {
          return false;
        }
        
        return true;
      });
    }
    
    // Tính hasMore
    const hasMore = filteredContacts.length === paginationOptions.pageSize && 
                   (paginationOptions.page * paginationOptions.pageSize) < total;
    
    return {
      contacts: filteredContacts,
      total: filteredContacts.length,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    
    // Nếu lỗi về index, hướng dẫn user
    if (error instanceof Error && error.message.includes('index')) {
      throw new Error('Cần tạo index trong Firebase. Vui lòng liên hệ admin để thiết lập.');
    }
    
    throw new Error('Không thể lấy danh sách liên hệ. Vui lòng thử lại sau.');
  }
};

export const getAllContacts = async (): Promise<ContactData[]> => {
  try {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const contacts: ContactData[] = [];
    
    querySnapshot.forEach((doc) => {
      contacts.push({
        id: doc.id,
        ...doc.data(),
      } as ContactData);
    });
    
    return contacts;
  } catch (error) {
    console.error('Error fetching all contacts:', error);
    throw new Error('Không thể lấy danh sách liên hệ. Vui lòng thử lại sau.');
  }
};
