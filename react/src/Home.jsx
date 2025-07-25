import React, { useState } from 'react';

const Home = () => {
	// Dummy data for items (to be replaced by backend data)
	const [items, setItems] = useState([
		{
			name: 'Soda',
			site: 'https://www.amazon.com',
			reminderDate: '2025-09-01',
		},
		{
			name: 'T-Shirt',
			site: 'https://www.amazon.com',
			reminderDate: '2025-09-01',
		},
		{
			name: 'Shoes',
			site: 'https://www.amazon.com',
			reminderDate: '2025-09-01',
		},
	]);

	// Handle adding a new item
	const handleAddItem = () => {
		const newItem = {
			name: 'New Item',
			site: 'https://example.com',
			reminderDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
		};
		setItems([...items, newItem]);
	};

	return (
		<div className="min-h-screen min-w-screen bg-gray-100 flex flex-col items-center">
			<h1 className="text-4xl font-bold text-center text-blue-600 mt-8 mb-6">
				Home Page
			</h1>
			<div className="w-full max-w-2xl">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-semibold text-gray-800">Subscriptions</h2>
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						onClick={handleAddItem}
					>
						Add
					</button>
				</div>
				{items.length === 0 ? (
					<p className="text-gray-500 text-center">No subscriptions found.</p>
				) : (
					<ul className="space-y-4">
						{items.map((item, index) => (
							<li
								key={index}
								className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
							>
								<div>
									<h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
									<a
										href={item.site}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500 hover:underline"
									>
										{item.site}
									</a>
									<p className="text-gray-600">
										Reminder: {new Date(item.reminderDate).toLocaleDateString()}
									</p>
								</div>
								<button
									className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
									onClick={() => alert(`Edit ${item.name}`)}
								>
									Edit
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Home;
