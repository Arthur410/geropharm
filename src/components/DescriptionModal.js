import Modal from 'react-modal';

export default function DescriptionModal(props) {
    return (
        <Modal
            className="description-modal"
            isOpen={props.isOpen}
            onRequestClose={props.onClose}
            style={{
                overlay: {
                    zIndex: 9999
                },
                content: {
                    zIndex: 10000
                }
            }}
        >
            <h5 className="modal-title">{props.item.title}</h5>
            <p className="modal-description">{props.item.body}</p>
            <button onClick={props.onClose}>Закрыть</button>
        </Modal>
    );
}
