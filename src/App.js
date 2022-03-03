import { useState, useEffect } from 'react';
import { TrashIcon, PencilAltIcon } from '@heroicons/react/outline';

const getLocalStorage = () => {
	let list = localStorage.getItem('list');
	if (list) {
		return (list = JSON.parse(localStorage.getItem('list')));
	} else {
		return [];
	}
};

const Alert = ({ type, msg, removeAlert, list }) => {
	useEffect(() => {
		const timeout = setTimeout(() => {
			removeAlert();
		}, 3000);
		return () => clearTimeout(timeout);
	}, [list]);
	return (
		<div
			className={`${type === 'danger' ? 'bg-red-200' : ''} ${
				type === 'success' ? 'bg-green-200' : ''
			} w-full p-3 mb-4 rounded-lg`}
		>
			<p className='text-lg text-center text-gray-500'>{msg}</p>
			{console.log('type:', type)}
		</div>
	);
};

function App() {
	const [name, setName] = useState('');
	const [list, setList] = useState(getLocalStorage());
	const [isEditing, setIsEditing] = useState(false);
	const [editID, setEditID] = useState(null);
	const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name) {
			showAlert(true, 'danger', 'please enter value');
		} else if (name && isEditing) {
			setList(
				list.map((item) => {
					if (item.id === editID) {
						return { ...item, title: name };
					}
					return item;
				})
			);
			setName('');
			setEditID(null);
			setIsEditing(false);
			showAlert(true, 'success', 'value changed');
		} else {
			const newItem = { id: new Date().getTime().toString(), title: name };

			setList([...list, newItem]);
			setName('');
			showAlert(true, 'success', 'value changed');
		}
	};
	const removeItem = (id) => {
		showAlert(true, 'danger', 'item removed');
		setList(list.filter((item) => item.id !== id));
	};
	const editItem = (id) => {
		const specificItem = list.find((item) => item.id === id);
		setIsEditing(true);
		setEditID(id);
		setName(specificItem.title);
	};
	const showAlert = (show = false, type = '', msg = '') => {
		setAlert({ show, type, msg });
	};
	useEffect(() => {
		localStorage.setItem('list', JSON.stringify(list));
	}, [list]);
	return (
		<div className='max-w-lg p-3 mx-auto mt-8 bg-white rounded-lg shadow '>
			<div className='p-3 mb-4 text-2xl text-center border-b'>
				Grocery budget app
			</div>
			{alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

			<form className='flex mb-8 rounded-lg' onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='e.g. eggs'
					value={name}
					onChange={(e) => setName(e.target.value)}
					className='w-full p-3 rounded-l-lg bg-slate-100'
				/>
				<button
					type='submit'
					className=' duration-300 rounded-r-lg bg-slate-400 hover:bg-slate-400/75 hover:ease-out `${isEditing ? px-8 :px-3 }`'
				>
					{isEditing ? 'Edit' : 'Submit'}
				</button>
			</form>
			{list &&
				list.map((item) => (
					<div
						className='flex items-center justify-between w-full p-3 mb-3 rounded-lg bg-slate-100 hover:shadow-md'
						key={item.id}
					>
						<p className='text-lg text-center text-slate-500'>{item.title}</p>
						<div className='flex items-center'>
							<PencilAltIcon
								onClick={() => editItem(item.id)}
								className='w-5 h-5 mr-3 duration-300 ease-out text-slate-400 hover:scale-125'
							/>
							<TrashIcon
								onClick={() => removeItem(item.id)}
								className='w-5 h-5 text-red-200 duration-300 ease-out hover:scale-125'
							/>
						</div>
					</div>
				))}
			{console.log(alert.show)}
		</div>
	);
}

export default App;
