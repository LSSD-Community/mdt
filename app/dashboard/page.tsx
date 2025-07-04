'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { Bars3Icon, XMarkIcon, UserIcon, DocumentPlusIcon, ArrowRightOnRectangleIcon, BookOpenIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { Hierarchy } from '@/components/dashboard/hierarchy';
import { fetchUserData, isAuthenticated, logout } from '@/lib/auth';
import { fetchAllCharacters, getCharactersForSpecificUser, getGradeName } from '@/lib/characters';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Profil');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allCharacters, setAllCharacters] = useState<any[]>([]);


  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserData().then((user) => {
        console.log('Fetched user data:', user);
        setCurrentUser(user);
        getCharactersForSpecificUser(user)
          .then((characters) => {
            console.log('Fetched characters:', characters);
            setAllCharacters(characters);
          });
      }).catch((error) => {
        console.error('Error fetching user data:', error);
        window.location.href = '/';
      });
    }
  }, []);
  
  if (!isAuthenticated()) {
    return null;
  }
  if (!currentUser) return null;

  console.log('Current user data:', currentUser);

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
              <h1 className="text-2xl font-bold mb-4 text-gray-900">{currentUser?.username}</h1>
              <p className='text-gray-600'>Bienvenue sur votre profil. Voici vos informations personnages.</p>

              { allCharacters.length > 0 ? (
                <div className='flex items-center space-x-4 mt-6'>
                  {allCharacters.map((character) => (
                    <div className="max-w-sm rounded-lg bg-white overflow-hidden shadow-lg mt-6">
                      <div className="px-6 py-4">
                        <div className="font-bold text-xl text-gray-800">{character.firstname} {character.lastname}</div>
                      </div>
                      <div className="px-6 pt-4 pb-2">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{getGradeName(character.grade_id)}</span>
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Unité inconnue</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (<></>)}  

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <button
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                >
                  Se déconnecter
                </button>
              </div>
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
            <Hierarchy />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
