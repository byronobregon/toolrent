import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import './App.css'
import CategoryList from './components/categories/CategoryList'
import CategoryForm from './components/categories/CategoryForm'
import ToolList from './components/tools/ToolList'
import ToolForm from './components/tools/ToolForm'
import ClientList from './components/clients/ClientList'
import ClientForm from './components/clients/ClientForm'
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

          <Route path="/tools" element={<ToolList />} />
          <Route path="/tools/new" element={<ToolForm />} />
          <Route path="/tools/edit/:tool_id" element={<ToolForm />} />

          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/edit/:clientRut" element={<ClientForm />} />
        </Routes>
      </SidebarProvider>
    </Router>
  )
}

export default App
