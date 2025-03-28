


import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Masters from './Masters/Masters';
import CustomerMaster from './Masters/CustomerMaster';
import SupplierMaster from './Masters/SupplierMaster';
import ProductMaster from './Masters/ProductMaster';
import MaterialMaster from './Masters/MaterialMaster';
import AccountMaster from './Masters/AccountMaster';
import LoginPage from './LogIn-SignUp/Login';
import Purchase from './Transaction/PurchaseEntry';
import { Navigate } from 'react-router-dom';
import Settings from './Settings/Setting';
import SalesEntry from './Transaction/Sales';
import ProductionEntry from './Transaction/ProductionEntry';
import Commonpage from './Commonpage';
import InwordAtStore from './Transaction/InwordAtStore';
import DeliveryChallan from './Transaction/DeliveryChallan';
import PurchaseOther from './Transaction/PurchaseOther';
import UserMaster from './Masters/UserMaster';
import Receipt from './Transaction/Receipt';

function App() {
  return (
    <HashRouter>

      <Routes>
        <Route index element={<Navigate to="/login" />} />
        <Route path='/login' element={<LoginPage />} />
        {/* <Route path='/coverpage' element={<Coverpage/>}/> */}
        <Route path="/" element={<Sidebar />}>          
          <Route path="/customermaster" element={<CustomerMaster />} />
          <Route path="/suppliermaster" element={<SupplierMaster />} />
          <Route path="/productmaster" element={<ProductMaster />} />
          <Route path="/materialmaster" element={<MaterialMaster />} />
          <Route path="/accountmaster" element={<AccountMaster />} />
          <Route path="/usermaster" element={<UserMaster/>} />
          {/* transactions */}
          <Route path="/Purchase" element={<Purchase/>} />
          <Route path="/salesentry" element={<SalesEntry/>} />
          <Route path="/productionentry" element={<ProductionEntry/>} />
          <Route path='/setting' element={<Settings/>}/>
          <Route path='/inwordatstore' element={<InwordAtStore/>}/>
          <Route path='/deliverychallan' element={<DeliveryChallan/>}/>
          <Route path='/Purchaseother' element={<PurchaseOther/>}/>
          <Route path='/receipts' element={<Receipt/>}/>
          <Route path="/commonpage" element={<Commonpage/>} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
