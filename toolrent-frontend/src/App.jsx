import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import './App.css'
import CategoryList from './components/categories/CategoryList'
import CategoryForm from './components/categories/CategoryForm'
import AppSidebar from './components/app-sidebar'

function App() {
  return (
    <Router>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <Routes>
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/edit/:category_id" element={<CategoryForm />} />
        </Routes>
      </SidebarProvider>
    </Router>
  )
}

export default App
