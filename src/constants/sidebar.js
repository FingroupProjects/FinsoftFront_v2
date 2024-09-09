
export default [

    {
        label: 'Дашборд',
        icon: 'pi pi-chart-pie',
        route: '/'
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
                        route: '/providerOrder',

                    },
                    {
                        label: 'Возврат товаров',
                        icon: 'pi pi-eraser',
                        route: '/providerReturn'
                    }
                ]
            },
            {
                title: 'Справочники',
                data: [
                    {
                        label: 'Конрагенты',
                        route: '/counterparty'
                    }
                ]
            },

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
                        route: '/clientSale'
                    },
                    {
                        label: 'Возврат от клиентов',
                        route: '/clientReturn'
                    },
                    {
                        label: 'Заказ клиентов',
                        route: '/clientOrder'
                    },
                    {
                        label: 'РМК',
                        route: '/for-sale'
                    },
                ]
            }
        ]
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
                        route: '/finance'
                    },
                    {
                        label: 'Расход средств',
                        route: '/'
                    },
                    {
                        label: 'Приход рас.сч',
                        route: '/'
                    },
                    {
                        label: 'Расход рас.сч',
                        route: '/'
                    }
                ]
            },
            {
                title: 'Отчёты',
                data:[
                    {
                        label:'Движение средств',
                        route:'/'
                    },
                    {
                        label:'Остаток средств',
                        route:'/'
                    }
                ]
            },
            {
                title: 'Справочники',
                data:[
                    {
                        label:'Банковские счета',
                        route: '/organizationBill'
                    },
                    {
                        label:'Кассы',
                        route: '/register'
                    },
                    {
                        label:'Валюта',
                        route: '/currency'
                    },
                    {
                        label:'Виды цен',
                        route: '/priceType'
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
                        route: '/posting'
                    },
                    {
                        label: 'Списание',
                        route: '/writeOff'
                    },
                    {
                        label:'Перемещение товаров',
                        route:'/movement'
                    },
                    {
                        label: 'Инвентаризация',
                        route: '/inventarization'
                    }
                ]
            },
            {
                title: 'Отчёты',
                data:[
                    {
                        label:'Остаток товаров',
                        route:'/'
                    },
                    {
                        label:'Движения товаров',
                        route:'/'
                    }
                ]
            },
            {
                title: 'Справочники',
                data:[
                    {
                        label:'Склады',
                        route: '/storage'
                    },
                    {
                        label:'Ед.Из',
                        route: '/unit'
                    },
                    {
                        label:'Товары',
                        route: '/warehouses'
                    },
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
                        label: 'Пользователи',
                        route: '/user'
                    },
                    {
                        label: 'Мои организации',
                        route: '/organization'
                    },
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
                        route: '/'
                    },
                    {
                        label: 'Магазины',
                        route: '/'
                    },
                    {
                        label: 'Склады',
                        route: '/'
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
                        route: '/'
                    },
                    {
                        label: 'Взаиморасчет с клиентами',
                        route: '/'
                    },
                    {
                        label: 'Акт сверки с поставщиками',
                        route: '/'
                    },
                    {
                        label: 'Акт сверки с клиентами',
                        route: '/'
                    },
                    {
                        label: 'Отчет покупки поставщиков',
                        route: '/'
                    },
                    {
                        label: 'Отчет покупки клиентов',
                        route: '/'
                    },
                    {
                        label: 'АБС анализ',
                        route: '/'
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
                title: 'Справочники',
                data :[
                    {
                        label: 'Сотрудники',
                        route: '/employee'
                    },
                    {
                        label: 'Должности',
                        route: '/position'
                    },
                    {
                        label: 'График работы',
                        route: '/schedule'
                    }

                ]
            },
            {
                title: 'Документы',
                data: [
                    {
                        label: 'Прием на работу',
                        route: '/hiring'
                    },
                    {
                        label: 'Кадровое перемещение',
                        route: '/staffMovement'
                    },
                    {
                        label: 'Увольнение',
                        route: '/firing'
                    },
                    {
                        label: 'Начисление зарплаты',
                        route: '/xz'
                    },
                    {
                        label: 'Оплата зарплаты',
                        route: '/'
                    },
                    {
                        label: 'Табель',
                        route: '/reportCard'
                    },
                    {
                        label: 'Ведомость зарплаты',
                        route: '/'
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
                        route: '/'
                    },
                    {
                        label: 'Должности',
                        route: '/'
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
                        route: '/'
                    },
                    {
                        label: 'Должности',
                        route: '/'
                    },
                    {
                        label: 'Прием на работу',
                        route: '/'
                    },
                ]
            },
            {
                title:'Справочник',
                data:[
                    {
                        label: 'Сотрудники2',
                        route: '/'
                    },
                    {
                        label: 'Должности',
                        route: '/'
                    },
                    {
                        label: 'Прием на работу',
                        route: '/'
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
                        route: '/'
                    },
                    {
                        label: 'Ввод начальных графика',
                        route: '/'
                    },
                    {
                        label: 'Погашения',
                        route: '/'
                    },
                    {
                        label: 'Ввод нач. остаток',
                        route: '/'
                    }
                ]
            }

        ]
    },


]
