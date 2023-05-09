import './Profile.css';
import Input from '@mui/material/Input';
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  
return (
  isAuthenticated && (
    <div>
      <img src={user.picture} alt={user.name} /> 
    <div class="row">
        <div class="column">
            <Input className="input-field" type="text" name="firstname" value=""  placeholder="First Name"/>
            <Input className="input-field" type="text" name="lastname" value=""  placeholder="Last Name"/>
            <Input editable={false} className="input-field" type="email" name="email" value="" placeholder="Email"/>
            <Input className="input-field" type="tel" name="phone" value=""  placeholder="Phone Number"/>
            <Input className="input-field" type="number" name="age" value=""  placeholder="Age"/>
            <Input className="input-field" type="number" name="height" value=""  placeholder="Height in Inches"/>
        </div>
        <div class="column">
          <h3>Horse Experience</h3>
          <Input className="input-field experience-field" type="text" name="horseExpYrs" value="" placeholder="Years?"/> Years <br></br>
          <FormControlLabel control={<Checkbox name="riding" checked={false} />} label="Horse Riding" /> <br></br>
          <FormControlLabel control={<Checkbox name="tacking" checked={false} />} label="Horse Tacking"/> <br></br>
          <FormControlLabel control={<Checkbox name="grooming" checked={false} />} label="Horse Grooming"/> <br></br>
          <FormControlLabel control={<Checkbox name="leading" checked={false}/>} label="Horse Leading"/> <br></br>
        </div>
    </div>
    </div>
  )
);
};

export default Profile;