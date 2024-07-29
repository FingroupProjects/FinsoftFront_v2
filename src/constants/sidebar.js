
export default [

    {
        label: 'Дашборд',
        icon: 'pi pi-chart-pie',
    },
    {
        label: 'Закупка',
        icon: 'pi pi-cart-plus',
        items: [
            {
                title: 'Документы',
                data:[
                    {
                        label: 'Поступление товаров',
                        icon: 'pi pi-palette',
                        route: '/purchase'
                    },
                    {
                        label: 'Заявка товаров',
                        icon: 'pi pi-eraser',
                        route: '/ppp',

                    },
                    {
                        label: 'Возврат товаров',
                        icon: 'pi pi-eraser',
                        route: '/333'
                    }
                ]
            },
            {
                title: 'Справочники',
                data: [
                    {
                        label: 'Конрагенты',
                        route: '/'
                    }
                ]
            }
        ]
    },
    {
        label: 'Продажа',
        icon: 'pi pi-shopping-cart',
        items: [
            {
                title: 'Документы',
                data:[
                    {
                        label: 'Продажа клиентам',
                        route: '/client'
                    },
                    {
                        label: 'Возврат от клиентов',
                        route: '/client'
                    },
                    {
                        label: 'Заказ клиентов',
                        route: '/client'
                    }
                ]
            }
        ]
    },
    {
        label: 'Товары',
        icon: 'pi pi-shield',
        route: '/rrr'
    },
    {
        label: 'Финансы',
        icon: 'pi pi-building-columns',
        items: [
            {
                title: 'Документы',
                data:[
                    {
                        label: 'Приход средств',
                        route: '/purchase'
                    },
                    {
                        label: 'Расход средств',
                        route: '/client'
                    },
                    {
                        label: 'Приход рас.сч',
                        route: '/client'
                    },
                    {
                        label: 'Расход рас.сч',
                        route: '/client'
                    }
                ]
            },
            {
                title: 'Отчёты',
                data:[
                    {
                        label:'Движение средств',
                        route:'/rrr'
                    },
                    {
                        label:'Остаток средств',
                        route:'/rrr'
                    }
                ]
            },
            {
                title: 'Справочники',
                data:[
                    {
                        label:'Банковские счета',
                        route: '/'
                    },
                    {
                        label:'Кассы',
                        route: '/mmm'
                    },
                    {
                        label:'Валюта',
                        route: '/mmm'
                    },
                    {
                        label:'Виды цен',
                        route: '/mmm'
                    },
                ]
            }
        ]
    },
    {
        label: 'Склады',
        icon: 'pi pi-inbox',
        items: [
            {
                title: 'Документы',
                data:[
                    {
                        label: 'Оприходование',
                        route: '/client'
                    },
                    {
                        label: 'Списание',
                        route: '/client'
                    },
                    {
                        label: 'Инвентаризация',
                        route: '/client'
                    }
                ]
            },
            {
                title: 'Отчёты',
                data:[
                    {
                        label:'Остаток товаров',
                        route:'/rrr'
                    },
                    {
                        label:'Движения товаров',
                        route:'/rrr'
                    },
                    {
                        label:'Перемещение товаров',
                        route:'/rrr'
                    }
                ]
            },
            {
                title: 'Справочники',
                data:[
                    {
                        label:'Склады',
                        route: '/mmm'
                    },
                    {
                        label:'Ед.Из',
                        route: '/mmm'
                    }
                ]
            }
        ]
    },
    {
        label: 'Справочники',
        icon: 'pi pi-align-center',
        items: [
            {
                datas:[
                    {
                        label: 'Единицы измериния',
                        route: '/purchase'
                    },
                    {
                        label: 'Пользователи',
                        route: '/'
                    },
                    {
                        label: 'Контрагенты',
                        route: '/2'
                    },
                    {
                        label: 'Мои организации',
                        route: '/client'
                    },
                    {
                        label: 'Виды цен',
                        route: '/client'
                    },
                    {
                        label: 'Волюты',
                        route: '/shopping',
                        component: () => import('@/components/ShoppingMovement.vue'),
                    }
                ]
            }
        ]
    },
    {
        label: 'Планирование',
        icon: 'pi pi-calendar-minus',
        items: [
            {
                datas: [
                    {
                        label: 'Товар',
                        route: '/client'
                    },
                    {
                        label: 'Магазины',
                        route: '/client'
                    },
                    {
                        label: 'Склады',
                        route: '/client'
                    }
                ]
            }
        ]
    },
    {
        label: 'Отчёты',
        icon: 'pi pi-upload',
        items: [
            {
                datas:[
                    {
                        label: 'Взаиморасчет с поставщиками',
                        route: '/client'
                    },
                    {
                        label: 'Взаиморасчет с клиентами',
                        route: '/client'
                    },
                    {
                        label: 'Акт сверки с поставщиками',
                        route: '/client'
                    },
                    {
                        label: 'Акт сверки с клиентами',
                        route: '/client'
                    },
                    {
                        label: 'Отчет покупки поставщиков',
                        route: '/client'
                    },
                    {
                        label: 'Отчет покупки клиентов',
                        route: '/client'
                    },
                    {
                        label: 'АБС анализ',
                        route: '/client'
                    },
                ]
            }
        ]
    },
    {
        label: 'Кадры',
        icon: 'pi pi-user',
        items: [
            {
                datas:[
                    {
                        label: 'Сотрудники',
                        route: '/client'
                    },
                    {
                        label: 'Должности',
                        route: '/client'
                    },
                    {
                        label: 'Прием на работу',
                        route: '/client'
                    },
                    {
                        label: 'Кадровое перемещение',
                        route: '/client'
                    },
                    {
                        label: 'Увольнение',
                        route: '/client'
                    },
                    {
                        label: 'Начисление зарплаты',
                        route: '/client'
                    },
                    {
                        label: 'Оплата зарплаты',
                        route: '/client'
                    },
                    {
                        label: 'Табель',
                        route: '/client'
                    },
                    {
                        label: 'Ведомость зарплаты',
                        route: '/client'
                    },
                ]
            }
        ]
    },
    {
        label: 'CRM',
        icon: 'pi pi-objects-column',
        items: [
            {
                title:'Документы',
                data:[
                    {
                        label: 'Сотрудники',
                        route: '/ee'
                    },
                    {
                        label: 'Должности',
                        route: '/ee'
                    },
                    {
                        label: 'Прием на работу',
                        route: '/purchase'
                    },
                ]
            },
            {
                title:'Отчёт',
                data:[
                    {
                        label: 'Сотрудники1',
                        route: '/w'
                    },
                    {
                        label: 'Должности',
                        route: '/d'
                    },
                    {
                        label: 'Прием на работу',
                        route: '/d'
                    },
                ]
            },
            {
                title:'Справочник',
                data:[
                    {
                        label: 'Сотрудники2',
                        route: '/d'
                    },
                    {
                        label: 'Должности',
                        route: '/d'
                    },
                    {
                        label: 'Прием на работу',
                        route: '/d'
                    },
                ]
            }

        ]
    },
    {
        label: 'Настройки',
        icon: 'pi pi-cog',
        items: [
            {
                datas:[
                    {
                        label: 'Настройка',
                        route: '/client'
                    },
                    {
                        label: 'Ввод начальных графика',
                        route: '/client'
                    },
                    {
                        label: 'Погашения',
                        route: '/client'
                    },
                    {
                        label: 'Ввод нач. остаток',
                        route: '/client'
                    }
                ]
            }

        ]
    },


]
