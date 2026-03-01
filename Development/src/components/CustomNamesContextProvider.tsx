import React from 'react';
import CustomNamesContext from './CustomNamesContext';

export const CustomNamesContextProvider = (props: any) => (
    <CustomNamesContext.Provider {...props} />
);
export default CustomNamesContextProvider;
