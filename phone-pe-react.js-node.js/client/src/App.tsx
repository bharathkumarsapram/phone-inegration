import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Success from './component/Success';
import Failure from './component/Failure';
import Phonepe from './file/phonepe/Phonepe';
const App = () => {
	return (
		<BrowserRouter>
			<div className='main'>
				<Routes>
					<Route path='/' element={<Phonepe />} />
					<Route path='/success' element={<Success />} />
					<Route path='/failure' element={<Failure />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
};

export default App;
