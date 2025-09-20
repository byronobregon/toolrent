import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </header>
          <div className='p-4'>
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
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Router>
  )
}

export default App
