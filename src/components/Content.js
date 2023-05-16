import CardList from './CardList';

export default function Content() {
    return (
        <main className="main">
            <div className="left-sidebar grey darken-1">
                <p>Left Sidebar</p>
            </div>
            <div className="main-content">
                <CardList />
            </div>
            <div className="right-sidebar grey darken-1">
                <p>Right Sidebar</p>
            </div>
        </main>
    );
}