import {useState} from 'react';
import DescriptionModal from './DescriptionModal';
export default function Card(props) {
    const {
        id,
        name,
        body,
    } = props;
    const item = {id: id, name: name, body:body}
    const [modalIsOpen, setModalIsOpen] = useState(false);

    function handleClick() {
        setModalIsOpen(true);
    }

    return (
        <div id={"product-" + id} className="card grey darken-1">
            <div className="card-content">
                <span className="card-title activator">
                    {name}
                </span>
            </div>
            <div className="card-action">
                <button className="card-button grey darken-1" onClick={handleClick}>Подробнее</button>
                <DescriptionModal
                    isOpen={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}
                    item={item}
                />
            </div>
        </div>
    );
}