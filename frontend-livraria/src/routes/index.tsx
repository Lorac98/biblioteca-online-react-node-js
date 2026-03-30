import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReadBook } from '../pages/ReadBook';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Home } from '../pages/Home';
import { AddBook } from '../pages/AddBook';
import { EditBook } from '../pages/EditBook';
import { Favorites } from '../pages/Favorites';
import { Profile } from '../pages/Profile';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Dashboard } from '../pages/Dashboard';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ler/:id" element={<ReadBook />} />
        <Route path="/" element={<Login />} />
       <Route path="/register" element={<Register />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/novo-livro" element={<AddBook />} />
        <Route path="/editar-livro/:id" element={<EditBook />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};