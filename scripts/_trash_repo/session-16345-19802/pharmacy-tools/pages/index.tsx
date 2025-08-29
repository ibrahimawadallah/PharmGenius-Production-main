import React from 'react';
import AutocompleteInput from '../components/AutocompleteInput';

export default function Home() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Pharmacy Tools Hub</h1>
      <AutocompleteInput placeholder='Search ICD or Drug...' fetchUrl='/api/icd-to-drug' onSelect={item => console.log(item)} />
    </div>
  );
}
