import { Button } from "@/components/ui/button";
import { Navbar } from "./components/ui/shared/Navbar";
import { ProfileHeader } from "./pages/Profile";
import {SignIn} from "./pages/Auth/Signin";
import {SignUp} from "./pages/Auth/Signup";
import './App.css'

function App() {

  return (
    <>
      <Navbar />
      {/* <ProfileHeader /> */}
      <SignUp />
      
    </>
  )
}

export default App
