//import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home/index';
import Header from './Header/index';
import BlogPage from './BlogPage/index';
import FormPage from './FormPage/index';



export const App = () => {
  return (
   <div className="App">
     <Router>
       <Header />
       <Routes>
         <Route path='/' element={<Home />} />
         {/* id を動的に受け取るために :id と記述 */}
         <Route path='/posts/:id' element={<BlogPage />} />
         <Route path="/form_page" element={<FormPage />} />

       </Routes>
     </Router>
   </div>
 );
}

export default App;