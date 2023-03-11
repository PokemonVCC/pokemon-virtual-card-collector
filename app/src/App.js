import './App.css';

import CardList from './components/card/CardList';

export default function App() {
	return (
		<div className='App'>
			<CardList cardWidth={'180px'}
				groupedBySet={true} />
		</div>
	);
}
