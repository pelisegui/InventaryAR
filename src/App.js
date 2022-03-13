import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
//import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppConfig } from './AppConfig';

//import { Crud } from './pages/Crud';
import { EmptyPage } from './pages/EmptyPage';
//import { TimelineDemo } from './pages/TimelineDemo';
import { CrudCheckingAccount } from './pages/CrudCheckingAccount';
import { CrudCustomer } from './pages/CrudCustomer';
import { CrudInventory } from './pages/CrudInventory';
import { CrudProduct } from './pages/CrudProduct';
import { CrudEmployee } from './pages/CrudEmployee';
import { CrudPriceList } from './pages/CrudPriceList';
import { CrudSaleOrder } from './pages/CrudSaleOrder';
import { CrudUser } from './pages/CrudUser';

import PrimeReact from 'primereact/api';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';

const App = () => {

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if(mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        {
            label: 'Home',
            items: [{
                label: 'Welcome', icon: 'pi pi-fw pi-home', to: '/'
            }]
        },
        {
            label: 'Ventas', icon: 'pi pi-fw pi-file',
            items: [
                //{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
                { label: 'Presupuestos', icon: 'pi pi-fw pi-table', to: '/crudSaleOrder' },
                { label: 'Vendedores', icon: 'pi pi-fw pi-table', to: '/crudEmployee' },
                { label: 'Lista de precios', icon: 'pi pi-fw pi-table', to: '/crudPriceList' }
            ]
        },
        {
            label: 'Productos', icon: 'pi pi-fw pi-file',
            items: [
                { label: 'Listado', icon: 'pi pi-fw pi-table', to: '/crudProduct' }                 
            ]
        },
        {
            label: 'Inventario', icon: 'pi pi-fw pi-file',
            items: [
                { label: 'Movimientos', icon: 'pi pi-fw pi-table', to: '/crudInventory' },
                //{ label: '+ Ingreso', icon: 'pi pi-fw pi-circle-off', to: '/addStock' },
                //{ label: '- Egreso', icon: 'pi pi-fw pi-circle-off', to: '/removeStock' }                   
            ]
        },
        {
            label: 'Clientes', icon: 'pi pi-fw pi-file',
            items: [
                { label: 'Listado', icon: 'pi pi-fw pi-table', to: '/crudCustomer' },
                { label: 'Cta. Cte.', icon: 'pi pi-fw pi-table', to: '/crudCheckingAccount' },           
            ]
        },
        {
            label: 'Seguridad', icon: 'pi pi-fw pi-file',
            items: [
                { label: 'Usuarios', icon: 'pi pi-fw pi-table', to: '/crudUser' }
                //{ label: 'Permisos', icon: 'pi pi-fw pi-table', to: '/crudProfiles' }
            ]
        },
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                       mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}/>

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Route path="/" exact component={EmptyPage} />
                {/* <Route path="/dashboard" component={Dashboard} /> */}
                    <Route path="/crudSaleOrder" component={CrudSaleOrder} />
                    <Route path="/crudEmployee" component={CrudEmployee} />
                    <Route path="/crudPriceList" component={CrudPriceList} />
                    <Route path="/crudProduct" component={CrudProduct} />
                    <Route path="/crudInventory" component={CrudInventory} />                   
                    <Route path="/crudCustomer" component={CrudCustomer} />
                    <Route path="/crudCheckingAccount" component={CrudCheckingAccount} />                   
                    <Route path="/crudUser" component={CrudUser} />
                    {/*
                    <Route path="/" exact component={Dashboard}/>
                    <Route path="/formlayout" component={FormLayoutDemo}/>
                    <Route path="/input" component={InputDemo}/>
                    <Route path="/floatlabel" component={FloatLabelDemo}/>
                    <Route path="/invalidstate" component={InvalidStateDemo}/>
                    <Route path="/button" component={ButtonDemo}/>
                    <Route path="/table" component={TableDemo}/>
                    <Route path="/list" component={ListDemo}/>
                    <Route path="/tree" component={TreeDemo}/>
                    <Route path="/panel" component={PanelDemo}/>
                    <Route path="/overlay" component={OverlayDemo}/>
                    <Route path="/menu" component={MenuDemo}/>
                    <Route path="/messages" component={MessagesDemo}/>
                    <Route path="/file" component={FileDemo}/>
                    <Route path="/chart" component={ChartDemo}/>
                    <Route path="/misc" component={MiscDemo}/>
                    <Route path="/timeline" component={TimelineDemo}/>
                    <Route path="/crud" component={Crud}/>
                    <Route path="/empty" component={EmptyPage}/>
                    <Route path="/documentation" component={Documentation}/>
                    */}
                </div>

            {/*    <AppFooter layoutColorMode={layoutColorMode}/> */}
            </div>
            {/*
            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                       layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />
            */}

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

        </div>
    );

}

export default App;
