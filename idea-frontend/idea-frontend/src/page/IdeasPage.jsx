// src/pages/IdeasPage.jsx
import React from 'react';
import IdeaList from '../components/IdeaList';

export default function IdeasPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Ideas</h1>
      <IdeaList showAll={true} />  {/* pass prop to allow fetching all ideas */}
    </div>
  );
}
