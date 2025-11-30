import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// ProjectInfo interface matching the JSON structure
export interface ProjectInfo {
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
    salesPolicy: string | {
      currency: string;
      pricing: Array<{
        unit_type: string;
        area_m2: number | string;
        price_min_billion: number;
        price_max_billion: number;
        price_min_vnd: number;
        price_max_vnd: number;
      }>;
      promotions: {
        loan_support: Array<{
          description: string;
          amount_percent: number;
          valid_until: string;
        }>;
        discounts: Array<{
          name: string;
          percent: number;
          condition: string;
        }>;
        free_management_months: number | null;
        extra_discounts: Array<{
          name: string;
          percent: number;
          condition: string;
        }>;
      };
      notes: {
        currency_note: string;
        date_format: string;
        assumptions: string;
      };
    };
    bankSupport: string;
    loanSupport: string;
    interestRatePolicy: string;
  };
  gallery: {
    images: string[];
    videos: string[];
  };
  attachments: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ProjectData extends ProjectInfo {
  id: string;
  createdAt: unknown;
  updatedAt?: unknown;
}

export interface ProjectFilterOptions {
  city?: string;
  district?: string;
  investor?: string;
  legalStatus?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

/**
 * Get all projects
 */
export const getAllProjects = async (): Promise<ProjectData[]> => {
  try {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const projects: ProjectData[] = [];

    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data(),
      } as ProjectData);
    });

    return projects;
  } catch (error) {
    console.error("Error fetching all projects:", error);
    throw new Error("Không thể lấy danh sách dự án. Vui lòng thử lại sau.");
  }
};

/**
 * Get projects with filtering and pagination
 */
export const getProjects = async (
  filterOptions: ProjectFilterOptions = {},
  paginationOptions: PaginationOptions = { page: 1, pageSize: 10 }
): Promise<{ projects: ProjectData[]; total: number; hasMore: boolean }> => {
  try {
    // Base query
    const q = query(
      collection(db, "projects"),
      orderBy("createdAt", "desc"),
      limit(paginationOptions.pageSize)
    );

    // Get total count
    const allDocsQuery = query(collection(db, "projects"));
    const totalSnapshot = await getDocs(allDocsQuery);
    const total = totalSnapshot.size;

    // Fetch documents
    const querySnapshot = await getDocs(q);
    const projects: ProjectData[] = [];

    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data(),
      } as ProjectData);
    });

    // Client-side filtering
    let filteredProjects = projects;

    // Filter by city
    if (filterOptions.city && filterOptions.city !== "all") {
      filteredProjects = filteredProjects.filter(
        (project) => project.location.city === filterOptions.city
      );
    }

    // Filter by district
    if (filterOptions.district && filterOptions.district !== "all") {
      filteredProjects = filteredProjects.filter(
        (project) => project.location.district === filterOptions.district
      );
    }

    // Filter by investor
    if (filterOptions.investor && filterOptions.investor !== "all") {
      filteredProjects = filteredProjects.filter((project) =>
        project.investor.includes(filterOptions.investor!)
      );
    }

    // Filter by legal status
    if (filterOptions.legalStatus && filterOptions.legalStatus !== "all") {
      filteredProjects = filteredProjects.filter(
        (project) => project.legalStatus === filterOptions.legalStatus
      );
    }

    // Search by term (project name, slogan, summary)
    if (filterOptions.searchTerm && filterOptions.searchTerm.trim()) {
      const searchTerm = filterOptions.searchTerm.trim().toLowerCase();
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.projectName.toLowerCase().includes(searchTerm) ||
          project.slogan.toLowerCase().includes(searchTerm) ||
          project.summary.toLowerCase().includes(searchTerm) ||
          project.location.address.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by price range
    if (
      filterOptions.minPrice !== undefined ||
      filterOptions.maxPrice !== undefined
    ) {
      filteredProjects = filteredProjects.filter((project) => {
        const pricePerSqm = parseFloat(
          project.pricing.pricePerSqm.replace(/[^\d.]/g, "")
        );
        if (isNaN(pricePerSqm)) return false;

        if (
          filterOptions.minPrice !== undefined &&
          pricePerSqm < filterOptions.minPrice
        ) {
          return false;
        }
        if (
          filterOptions.maxPrice !== undefined &&
          pricePerSqm > filterOptions.maxPrice
        ) {
          return false;
        }
        return true;
      });
    }

    const hasMore =
      filteredProjects.length === paginationOptions.pageSize &&
      paginationOptions.page * paginationOptions.pageSize < total;

    return {
      projects: filteredProjects,
      total: filteredProjects.length,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);

    if (error instanceof Error && error.message.includes("index")) {
      throw new Error(
        "Cần tạo index trong Firebase. Vui lòng liên hệ admin để thiết lập."
      );
    }

    throw new Error("Không thể lấy danh sách dự án. Vui lòng thử lại sau.");
  }
};

/**
 * Get a single project by ID
 */
export const getProjectById = async (
  id: string
): Promise<ProjectData | null> => {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as ProjectData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error("Không thể lấy thông tin dự án. Vui lòng thử lại sau.");
  }
};

/**
 * Add a new project
 */
export const addProject = async (projectData: ProjectInfo): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding project:", error);
    throw new Error("Không thể thêm dự án. Vui lòng thử lại sau.");
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (
  id: string,
  projectData: Partial<ProjectInfo>
): Promise<void> => {
  try {
    const docRef = doc(db, "projects", id);
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Không thể cập nhật dự án. Vui lòng thử lại sau.");
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Không thể xóa dự án. Vui lòng thử lại sau.");
  }
};

/**
 * Get all project IDs (for static generation)
 */
export const getAllProjectIds = async (): Promise<{ id: string }[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching project IDs:", error);
    throw new Error("Không thể lấy danh sách ID dự án. Vui lòng thử lại sau.");
  }
};
