import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, startAfter, where, WhereFilterOp } from 'firebase/firestore';

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
    let q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    
    // Apply filters
    if (filterOptions.name) {
      q = query(q, where('name', '>=', filterOptions.name), where('name', '<=', filterOptions.name + '\uf8ff'));
    }
    
    if (filterOptions.service && filterOptions.service !== 'all') {
      q = query(q, where('service', '==', filterOptions.service));
    }
    
    if (filterOptions.startDate) {
      q = query(q, where('createdAt', '>=', filterOptions.startDate));
    }
    
    if (filterOptions.endDate) {
      q = query(q, where('createdAt', '<=', filterOptions.endDate));
    }
    
    // Get total count first
    const totalSnapshot = await getDocs(q);
    const total = totalSnapshot.size;
    
    // Apply pagination
    const startIndex = (paginationOptions.page - 1) * paginationOptions.pageSize;
    if (startIndex > 0) {
      const lastDoc = totalSnapshot.docs[startIndex - 1];
      q = query(q, startAfter(lastDoc));
    }
    
    q = query(q, limit(paginationOptions.pageSize));
    
    const querySnapshot = await getDocs(q);
    const contacts: ContactData[] = [];
    
    querySnapshot.forEach((doc) => {
      contacts.push({
        id: doc.id,
        ...doc.data(),
      } as ContactData);
    });
    
    const hasMore = startIndex + paginationOptions.pageSize < total;
    
    return {
      contacts,
      total,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
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
