'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon, UserIcon, DocumentPlusIcon, ArrowRightOnRectangleIcon, BookOpenIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Profil');

  const sections = [
    { name: 'Profil', icon: UserIcon },
    { name: 'Rapport d\'arrestation', icon: DocumentPlusIcon },
    { name: 'Mutation', icon: ArrowRightOnRectangleIcon },
    { name: 'Documentation', icon: BookOpenIcon },
    { name: 'Hiérarchie', icon: BuildingLibraryIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {sections.map((section) => (
            <button
              key={section.name}
              onClick={() => {
                setActiveSection(section.name);
                setSidebarOpen(false);
              }}
              className={`flex items-center px-4 py-2 text-left rounded-lg ${activeSection === section.name ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              <section.icon className="h-5 w-5 mr-3" />
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between bg-white p-4 shadow md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-bold">{activeSection}</h2>
        </div>

        <div className="flex-1 p-6">
          {activeSection === 'Profil' && (
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-900">Profil</h1>
              <p className='text-gray-600'>Bienvenue sur votre profil. Voici vos informations personnelles.</p>
            </div>
          )}

          {activeSection === 'Rapport d\'arrestation' && (
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-900">Créer un rapport d'arrestation</h1>
              <p className='text-gray-600'>Formulaire de création de rapport d'arrestation à venir...</p>
            </div>
          )}

          {activeSection === 'Mutation' && (
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-900">Mutation</h1>
              <p className='text-gray-600'>Vous pouvez gérer vos demandes de mutation ici.</p>
            </div>
          )}

          {activeSection === 'Documentation' && (
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-900">Documentation</h1>
              <p className='text-gray-600'>Accédez aux documents officiels et aux ressources internes.</p>
            </div>
          )}

          {activeSection === 'Hiérarchie' && (
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-900">Hiérarchie</h1>
              <p className='text-gray-600'>Consultez la structure hiérarchique de l'organisation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
