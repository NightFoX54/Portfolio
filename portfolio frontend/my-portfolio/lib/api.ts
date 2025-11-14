import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://berkay-portfolio.duckdns.org/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
const tokenManager = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('username')
    }
  }
}

// Configure axios to include token in requests
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

// Types
export interface PersonalInfo {
  id?: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  workTitle?: string
  profilePicture?: string
  resume?: string
}

export interface Project {
  id?: string
  projectName: string
  projectDescription: string
  projectLink: string
  projectLink2?: string
  projectLink3?: string
  projectContentType: 'IMAGE' | 'VIDEO'
  projectContent?: string
  projectTechnologies: string
  displayOrder: number
}

export interface JobHistory {
  id?: string
  companyName: string
  jobTitle: string
  startDate: string
  endDate?: string | null
  isCurrent: boolean
  description: string
  location: string
  displayOrder: number
  companyLogo?: string
}

export interface EducationHistory {
  id?: string
  schoolName: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate?: string | null
  isCurrent: boolean
  description: string
  location: string
  gpa: string
  displayOrder: number
}

export interface ProfessionalSkill {
  id?: string
  skillName: string
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  displayOrder: number
}

export interface ProjectDetailContent {
  id?: string
  projectId: string
  projectDetailContentType: 'TEXT' | 'IMAGE' | 'VIDEO'
  projectDetailContent: string
  displayOrder: number
}

// API Functions
export const personalInfoApi = {
  getAll: () => api.get<PersonalInfo[]>('/personal-info/fetch').catch(error => {
    console.error('Error fetching personal info:', error);
    return { data: [] };
  }),
  getById: (id: string) => api.get<PersonalInfo>(`/personal-info/${id}`),
  create: (data: PersonalInfo) => api.post<PersonalInfo>('/personal-info', data),
  update: (id: string, data: PersonalInfo) => api.put<PersonalInfo>(`/personal-info/${id}`, data),
  delete: (id: string) => api.delete(`/personal-info/${id}`),
  createWithMedia: (formData: FormData) => api.post<PersonalInfo>('/personal-info/with-media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateWithMedia: (id: string, formData: FormData) => api.put<PersonalInfo>(`/personal-info/${id}/with-media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects/fetch').catch(error => {
    console.error('Error fetching projects:', error);
    return { data: [] };
  }),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (data: Project) => api.post<Project>('/projects', data),
  update: (id: string, data: Project) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  createWithMedia: (formData: FormData) => api.post<Project>('/projects/with-media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateWithMedia: (id: string, formData: FormData) => api.put<Project>(`/projects/${id}/with-media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const jobHistoryApi = {
  getAll: () => api.get<JobHistory[]>('/job-history/fetch').catch(error => {
    console.error('Error fetching job history:', error);
    return { data: [] };
  }),
  getById: (id: string) => api.get<JobHistory>(`/job-history/${id}`),
  create: (data: JobHistory) => api.post<JobHistory>('/job-history', data),
  update: (id: string, data: JobHistory) => api.put<JobHistory>(`/job-history/${id}`, data),
  delete: (id: string) => api.delete(`/job-history/${id}`),
  createWithMedia: (formData: FormData) => api.post<JobHistory>('/job-history/with-media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateWithMedia: (id: string, formData: FormData) => api.put<JobHistory>(`/job-history/${id}/with-media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const educationHistoryApi = {
  getAll: () => api.get<EducationHistory[]>('/education-history/fetch').catch(error => {
    console.error('Error fetching education history:', error);
    return { data: [] };
  }),
  getById: (id: string) => api.get<EducationHistory>(`/education-history/${id}`),
  create: (data: EducationHistory) => api.post<EducationHistory>('/education-history', data),
  update: (id: string, data: EducationHistory) => api.put<EducationHistory>(`/education-history/${id}`, data),
  delete: (id: string) => api.delete(`/education-history/${id}`)
}

export const professionalSkillsApi = {
  getAll: () => api.get<ProfessionalSkill[]>('/professional-skills/fetch').catch(error => {
    console.error('Error fetching professional skills:', error);
    return { data: [] };
  }),
  getById: (id: string) => api.get<ProfessionalSkill>(`/professional-skills/${id}`),
  create: (data: ProfessionalSkill) => api.post<ProfessionalSkill>('/professional-skills', data),
  update: (id: string, data: ProfessionalSkill) => api.put<ProfessionalSkill>(`/professional-skills/${id}`, data),
  delete: (id: string) => api.delete(`/professional-skills/${id}`)
}

export const projectDetailContentApi = {
  getAll: () => api.get<ProjectDetailContent[]>('/project-detail-content/fetch').catch(error => {
    console.error('Error fetching project detail content:', error);
    return { data: [] };
  }),
  getById: (id: string) => api.get<ProjectDetailContent>(`/project-detail-content/${id}`),
  getByProjectId: (projectId: string) => api.get<ProjectDetailContent[]>(`/project-detail-content/project/${projectId}`),
  create: (data: ProjectDetailContent) => api.post<ProjectDetailContent>('/project-detail-content', data),
  update: (id: string, data: ProjectDetailContent) => api.put<ProjectDetailContent>(`/project-detail-content/${id}`, data),
  delete: (id: string) => api.delete(`/project-detail-content/${id}`),
  createWithMedia: (formData: FormData) => api.post<ProjectDetailContent>('/project-detail-content/with-media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateWithMedia: (id: string, formData: FormData) => api.put<ProjectDetailContent>(`/project-detail-content/${id}/with-media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export default api
