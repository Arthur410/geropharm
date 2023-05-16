import {useEffect, useRef, useState} from 'react'
import Preloader from './Preloader'
import Card from './Card'

export default function CardList(props) {
    const API_LINK = 'https://jsonplaceholder.typicode.com' // апишка
    const [items, setItems] = useState([]) // плашки
    const [displayedItems, setDisplayedItems] = useState(0) // количество выведенных плашек
    const [loading, setLoading] = useState(true) // загрузка
    const gridRef = useRef(null) // ссылка на блок с плашками
    const cardWidth = 150 // статическая ширина плашки
    const cardHeight = 100 // статическая высота плашки

    // Функция для получения отступа и вмещенных плашек (либо по вертикали, либо по горизонтали)
    const getGap = (size, cardSize, minGap=30) => {
        let cardCount = Math.floor(size / cardSize)
        let gapSpace = size - cardCount*cardSize

        while (gapSpace - (cardCount + 1)*minGap < 0) {
            cardCount -= 1
            gapSpace = size - cardCount*cardSize
        }

        return [Math.floor(gapSpace / (cardCount + 1)), cardCount]
    };

    // Функция для применения стилей сетке
    const setStylesToGrid = (grid, minWidthGap, minHeightGap) => {
        grid.style.gridColumnGap = `${minWidthGap}px`
        grid.style.gridRowGap = `${minHeightGap}px`
        grid.style.padding = `${minHeightGap}px ${minWidthGap}px`
    }

    // Функция для получения отступа и вмещенных плашек (всего)
    const getItemsCount = (grid, width, height) => {
        const [minWidthGap, horizontalCardsCount] = getGap(width, cardWidth)
        const [minHeightGap, verticalCardsCount] = getGap(height, cardHeight)
        // Сразу применим найденные отступы
        setStylesToGrid(grid, minWidthGap, minHeightGap)

        return horizontalCardsCount * verticalCardsCount
    };

    // Функция, иниализирующая плашки
    const cardsInit = () => {
        fetch(`${API_LINK}/comments`)
            .then(response => response.json())
            .then(data => {
                let currentWidth = gridRef.current.offsetWidth
                let currentHeight = gridRef.current.offsetHeight

                setDisplayedItems(getItemsCount(gridRef.current, currentWidth, currentHeight))
                setItems(data.slice(0, displayedItems));
                setLoading(false);
            }).catch(error => {
                console.error('Ошибка при выполнении запроса:', error)
            });
    };

    useEffect(() => {
        cardsInit()
    }, [displayedItems]);

    useEffect(() => {
        // Функция, отвечающая за ререндер плашек
        const reloadCards = () => {
            setLoading(true);
            let currentWidth = gridRef.current.parentNode.offsetWidth
            let currentHeight = gridRef.current.parentNode.offsetHeight

            let newItemsCount = getItemsCount(gridRef.current, currentWidth, currentHeight)

            if (newItemsCount > items.length) {
                // Подгружаем недостающие плашки
                fetch(`${API_LINK}/comments?_start=${items.length}&_limit=${newItemsCount - items.length}`)
                    .then(response => response.json())
                    .then(data => {
                        setItems([...items, ...data])
                        setLoading(false);
                    }).catch(error => {
                        console.error('Ошибка при выполнении запроса:', error)
                    });
            } else if (newItemsCount < items.length) {
                // Убираем невместившие плашки
                let itemsToRemove = items.length - newItemsCount
                setItems(prevItems => prevItems.slice(0, -itemsToRemove));
                setLoading(false)
            } else {
                // оказались равны, т.е. никаких действий :)
                setLoading(false)
            }

        };

        window.addEventListener('resize', reloadCards);

        return () => {
            window.removeEventListener('resize', reloadCards);
        };
    }, [items]);

    return (
        <div className="items" ref={gridRef}>
            {loading ? (
                <Preloader />
            ) : items.length ? (
                items.map(item => (
                    <Card key={item.id} {...item}/>
                ))
            ) : (
                <p>Не удалось загрузить список товаров</p>
            )}
        </div>
    )
}