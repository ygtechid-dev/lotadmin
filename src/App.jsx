import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Table from "./pages/Table";
import AuthLayout from "./components/Layout/AuthLayout";
import GuestLayout from "./components/Layout/GuestLayout";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import Pengiriman from "./pages/Pengiriman";

import Form from "./pages/Form";
import RegisterIndex from "./pages/auth/Register";
import MasterExpired from "./pages/MasterDataBanner";
import MasterUser from "./pages/MasterUser";
import MasterDataUser from "./pages/MasterDataUser";
import MasterDataBanner from "./pages/MasterDataBanner";
import ListKajianTable from "./pages/ListKajianTable";
import MasterDataPemenang from "./pages/MasterDataPemenang";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/table" element={<Table />}></Route>
        <Route path="/MasterUser" element={<MasterUser />}></Route>
        <Route path="/MasterDataBanner" element={<MasterDataBanner />}></Route>
        <Route path="/MasterDataUser" element={<MasterDataUser />}></Route>


        <Route path="/ListKajianTable" element={<ListKajianTable />}></Route>
        <Route path="/kirim" element={<Pengiriman />}></Route>
        <Route path="/MasterDataPemenang" element={<MasterDataPemenang />}></Route>


        <Route path="/form" element={<Form />}></Route>
      </Route>
      <Route path="/auth" element={<GuestLayout />}>
        <Route path="/auth/login" element={<Login />}></Route>
        <Route path="/auth/register" element={<RegisterIndex />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
