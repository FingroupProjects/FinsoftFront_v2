export default [
    {
        label: 'Дашборд',
        icon: 'pi pi-link',
    },
    {
        label: 'Закупка',
        icon: 'pi pi-palette',
        items: [
            {
                label: 'Поступление товаров',
                icon: 'pi pi-eraser',
                route: '/purchase'
            },
            {
                label: 'Заявка товаров',
                icon: 'pi pi-heart',
                route: ''
            }
        ]
    },
    {
        label: 'Programmatic',
        icon: 'pi pi-link',
    },
    {
        label: 'External',
        icon: 'pi pi-home',
        items: [
            {
                label: 'Vue.js',
                icon: 'pi pi-star',
                url: 'https://vuejs.org/'
            },
            {
                label: 'Vite.js',
                icon: 'pi pi-bookmark',
                url: 'https://vuejs.org/'
            }
        ]
    }

]
