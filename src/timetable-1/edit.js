const {__} = wp.i18n;
const {Component} = wp.element;
const {RichText, InspectorControls, PanelColorSettings} = wp.editor;
const {PanelBody, Popover, CheckboxControl, BaseControl} = wp.components;

import {defaultItem, getStyles, typographyArr} from './block';
import {InspectorContainer, ContainerEdit} from '../commonComponents/container/container';
import {getTypography, TypographyContainer} from '../commonComponents/typography/typography';
import {Plus} from '../commonComponents/icons/plus';

/**
 * Keys for new blocks
 * @type {number}
 */
let key = 0;

/**
 * The edit function describes the structure of your block in the context of the editor.
 * This represents what the editor will render when the block is used.
 *
 * The "edit" property must be a valid function.
 * @param {Object} props - attributes
 * @returns {Node} rendered component
 */
export default class Edit extends Component {
    state = {
        popupVisibleIndex: -1,
    };

    /**
     * Add a new item to list with default fields
     */
    addItem = (header, row) => {
        key++;
        const localKey = 'new ' + new Date().getTime();
        this.props.setAttributes({
            items: [...this.props.attributes.items, {
                ...defaultItem,
                title: defaultItem.title + ' ' + (key),
                header: header,
                row: row,
                class: this.props.attributes.activeClass,
                month: this.props.attributes.activeMonth,
                key: localKey,
            }],
        });
        this.setState({popupVisibleIndex: localKey});
        debugger;
    };

    /**
     * Change any property of item
     * @param {string} property - editable field
     * @param {string} value - for field
     * @param {number} index - of items array
     * @param {boolean} withMutation - in some cases we should avoid mutation for force rerender component
     */
    onChangePropertyItem = (property, value, key) => {
        const items = [...this.props.attributes.items];
        const index = items.findIndex(item => item.key === key);
        if (!items[index]) {
            return;
        }
        items[index][property] = value;
        this.props.setAttributes({items: items});
    };

    /**
     * Remove item
     * It also add default item if we remove all elements from array
     * @param {number} index - of item
     */
    removeItem = (key) => {
        const items = [...this.props.attributes.items];
        if (items.length === 1) {
            this.props.setAttributes({
                items: [{
                    ...defaultItem,
                }],
            });
        } else {
            const index = items.findIndex(item => item.key === key);
            items.splice(index, 1);
            this.props.setAttributes({items: items});
        }
    };

    addColumn = () => {
        this.props.setAttributes({
            headerItems: [...this.props.attributes.headerItems, {
                name: __('FRIDAY', 'kenzap-timetable'),
                value: 'new ' + new Date().getTime(),
            }],
        });
    };

    deleteColumn = (index) => {
        if( confirm(__('All courses related to this column will be removed. Continue?', 'kenzap-timetable'))) {
            const headerItems = [...this.props.attributes.headerItems];
            this.clearUselessItems({type: 'header', value: headerItems[index].value});

            if (headerItems.length === 1) {
                this.props.setAttributes({
                    headerItems: [{
                        name: __('MONDAY', 'kenzap-timetable'),
                        value: 'new ' + new Date().getTime(),
                    }],
                });
            } else {
                headerItems.splice(index, 1);
                this.props.setAttributes({headerItems});
            }
        }
    };

    deleteRow = (index) => {
        if( confirm(__('All events will be removed related to deleting row. Do you want to continue?', 'kenzap-timetable'))) {
            const rows = [...this.props.attributes.rows];
            this.clearUselessItems({type: 'row', value: rows[index].value});

            if (rows.length === 1) {
                this.props.setAttributes({
                    rows: [{
                        name: __('9am', 'kenzap-timetable'),
                        value: 'new ' + new Date().getTime(),
                    }],
                });
            } else {
                rows.splice(index, 1);
                this.props.setAttributes({rows});
            }
        }
    };

    addRow = () => {
        this.props.setAttributes({
            rows: [...this.props.attributes.rows, {
                name: __('9am', 'kenzap-timetable'),
                value: 'new ' + new Date().getTime(),
            }],
        });
    };

    /**
     * Remove filter
     * It also add default item if we remove all elements from array
     * @param {number} index - of item
     */
    removeFilter = (index, filterType) => {

        const filters = [...this.props.attributes[filterType]];
        if(filters.length<2){
            alert(__('Can not remove. At least one filter is required.', 'kenzap-timetable'))
            return;
        }

        if( confirm(__('All courses related to this filter will be removed. Continue?', 'kenzap-timetable'))) {

            const removeFilterValue = filters[index].value;
            let items = [...this.props.attributes.items];

            const findingValue = filterType === 'classFilters' ? 'class' : 'month';

            items = items.filter(item => item[findingValue] !== removeFilterValue)
            filters.splice(index, 1);
            const activeFilter = filters[0] && filters[0].value ? filters[0].value : '';
            this.props.setAttributes({
                [filterType]: filters,
                items,
                [findingValue === 'class' ? 'activeClass' : 'activeMonth']: activeFilter,
            });
            this.setState({
                [findingValue === 'class' ? 'activeClass' : 'activeMonth']: activeFilter,
            })
        }
    };

    /**
     * Add a new item to list with default fields
     */
    addFilter = (type) => {
        key++;
        this.props.setAttributes({
            [type]: [...this.props.attributes[type], {
                name: __('New filter ', 'kenzap-timetable') + key,
                value: 'filter' + new Date().getTime(),
            }],
        });
    };

    clearUselessItems = (data) => {
        const items = [...this.props.attributes.items].filter(item => item[data.type] !== data.value)
        this.props.setAttributes({items});
    };

    isOneItemOnRow = (row) =>
        this.props.attributes.items.filter(item =>
            item.row === row &&
            item.month === this.props.attributes.activeMonth &&
            item.class === this.props.attributes.activeClass
        ).find(i => i.isAllDays === true);

    render() {
        const {
            className,
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const {vars, kenzapContanerStyles} = getStyles(attributes);

        return (
            <div>
                <InspectorControls>
                    <PanelBody
                        title={__('General', 'kenzap-timetable')}
                        initialOpen={true}
                    >
                        <CheckboxControl
                            label={__('Filters', 'kenzap-timetable')}
                            checked={attributes.isFilterShow}
                            onChange={(isFilterShow) => {
                                setAttributes({isFilterShow});
                            }}
                        />

                        {attributes.isFilterShow && <BaseControl
                            id="Manage-filters-1"
                        >
                            {['classFilters', 'monthFilters'].map(filterType => {
                                    return (
                                        <div style={{ marginBottom: '25px' }}>
                                            <div style={{ marginBottom: '8px' }}><b>{filterType === 'classFilters' ? __('Class filters', 'kenzap-timetable') : __('Month filters', 'kenzap-timetable')}</b></div>
                                            {attributes[filterType].map((filter, index) => (
                                                <div key={filter.value}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'flex-start',
                                                            alignItems: 'center',
                                                            marginBottom: '5px',
                                                        }}
                                                    >
                                                        <i onClick={() => this.removeFilter(index, filterType)}
                                                           style={{lineHeight: 1, cursor: 'pointer', marginRight: '5px'}}
                                                           className="dashicons dashicons-no"/>

                                                        <RichText
                                                            tag="span"
                                                            value={filter.name}
                                                            onChange={(value) => {
                                                                const filters = [...attributes[filterType]];
                                                                filters[index].name = value;
                                                                setAttributes({[filterType]: filters});
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => this.addFilter(filterType)}
                                            >
                                                <span style={{lineHeight: 1, marginRight: '5px'}}><Plus/></span>
                                                <span>{__('Add new filter', 'kenzap-timetable')}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            )}

                        </BaseControl>
                        }
                    </PanelBody>
                    <TypographyContainer
                        setAttributes={setAttributes}
                        typographyArr={typographyArr}
                        {...attributes}
                    />
                    <InspectorContainer
                        setAttributes={setAttributes}
                        {...attributes}
                        withPadding
                        withWidth100
                        withBackground
                        withAutoPadding
                    />
                </InspectorControls>
                <div className={`${ className ? className : '' } `} style={{...vars}}>
                    <ContainerEdit
                        className={`kp-timetable-2 kenzap-lg ${ isSelected ? 'selected' : '' } `}
                        attributes={attributes}
                        withBackground
                        withPadding
                    >
                        <div className="kenzap-container admin" style={kenzapContanerStyles}>
                            <div className="kp-table">
                                {attributes.isFilterShow && <ul className="kp-filter">
                                    <select style={getTypography(attributes, 3)} value={this.props.attributes.activeClass} onChange={(event) => {
                                        this.props.setAttributes({activeClass: event.target.value})
                                    }}>
                                        {attributes.classFilters.map(filter => (
                                            <option key={filter.value} value={filter.value}>{filter.name}</option>
                                        ))}
                                    </select>
                                    <select style={getTypography(attributes, 3)} value={this.props.attributes.activeMonth} onChange={(event) => {
                                        this.props.setAttributes({activeMonth: event.target.value})
                                    }}>
                                        {attributes.monthFilters.map(filter => (
                                            <option key={filter.value} value={filter.value}>{filter.name}</option>
                                        ))}
                                    </select>
                                </ul>
                                }
                            </div>

                            <div className="kp-header admin">
                                <ul>
                                    <li className="kp-clock-image"/>
                                    {attributes.headerItems.map((headerItem, index) => (
                                        <li key={headerItem.value}>
                                            <button className="remove" onClick={() => this.deleteColumn(index)}>
                                                <span className="dashicons dashicons-no"/>
                                            </button>
                                            <RichText
                                                tag="span"
                                                key={headerItem.value}
                                                value={headerItem.name}
                                                onChange={(value) => {
                                                    const headerItems = [...attributes.headerItems];
                                                    headerItems[index].name = value;
                                                    setAttributes({headerItems});
                                                }}
                                                style={getTypography(attributes, 0)}
                                            />
                                        </li>
                                    ))}
                                    <li onClick={this.addColumn}>{__('Add column', 'kenzap-timetable')}</li>
                                </ul>
                            </div>

                            <div className="kp-content admin" style={{display: 'block'}}>
                                {attributes.rows.map((row, index) => (
                                    <ul key={row.value}>
                                        <li style={getTypography(attributes, 0)} className="row-edit">
                                            <RichText
                                                tag="span"
                                                value={row.name}
                                                onChange={(value) => {
                                                    const rows = [...attributes.rows];
                                                    rows[index].name = value;
                                                    setAttributes({rows});
                                                }}
                                            />
                                        </li>
                                        {attributes.headerItems.map((headerItem, index) => {
                                            const isOneItemOnRow = this.isOneItemOnRow(row.value);

                                            if (isOneItemOnRow && index !== 0) {
                                                return null;
                                            }

                                            const currentItem = attributes.items.find(
                                                item => item.row === row.value &&
                                                    item.header === headerItem.value &&
                                                    item.month === attributes.activeMonth &&
                                                    item.class === attributes.activeClass
                                            );
                                            if (currentItem) {
                                                return (
                                                    <li
                                                        key={headerItem.value}
                                                        className={`itemEdit ${isOneItemOnRow ? `break day-${attributes.headerItems.length}` : ''}`}
                                                    >
                                                        <div onClick={() => {
                                                            this.setState({popupVisibleIndex: currentItem.key});
                                                        }}>
                                                            <button className="remove"
                                                                    onClick={() => this.removeItem(currentItem.key)}>
                                                                <i className="dashicons dashicons-no"/>
                                                            </button>

                                                            <span style={{background: currentItem.color}} >
                                                            <RichText
                                                                tag="p"
                                                                value={currentItem.period}
                                                                onChange={(value) => {
                                                                    this.onChangePropertyItem('period', value, currentItem.key)
                                                                }}
                                                                style={getTypography(attributes, 1)}
                                                            />
                                                            <RichText
                                                                tag="p"
                                                                className="kp-nameAdmin"
                                                                value={currentItem.name}
                                                                onChange={(value) => {
                                                                    this.onChangePropertyItem('name', value, currentItem.key)
                                                                }}
                                                                style={getTypography(attributes, 2)}
                                                            />
                                                        </span>
                                                        </div>
                                                        {this.state.popupVisibleIndex === currentItem.key &&
                                                        <Popover
                                                            focusOnMount={false}
                                                            className="kp-timetable-2-link-popover"
                                                        >
                                                            <i
                                                                onClick={() => this.setState({popupVisibleIndex: -1})}
                                                                style={{
                                                                    lineHeight: 1,
                                                                    cursor: 'pointer',
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    right: 0,
                                                                }}
                                                                className="dashicons dashicons-no"
                                                            />
                                                            <div className="popover">
                                                                <CheckboxControl
                                                                    label={__('Full width', 'kenzap-timetable')}
                                                                    checked={currentItem.isAllDays}
                                                                    help={__('This will remove other events from selected row.', 'kenzap-timetable')}
                                                                    onChange={(isAllDays) => {
                                                                        if(isAllDays) {
                                                                            const cItem = {...currentItem};
                                                                            const items = attributes.items.filter(
                                                                                item =>
                                                                                    item.row !== row.value &&
                                                                                    item.month === attributes.activeMonth &&
                                                                                    item.class === attributes.activeClass
                                                                            );
                                                                            items.push(
                                                                                {
                                                                                    name: cItem.name,
                                                                                    period: cItem.period,
                                                                                    header: attributes.headerItems[0].value,
                                                                                    row: row.value,
                                                                                    class: this.props.attributes.activeClass,
                                                                                    month: this.props.attributes.activeMonth,
                                                                                    color: cItem.color,
                                                                                    isAllDays: true,
                                                                                    key: 'new ' + new Date().getTime(),
                                                                                }
                                                                            );
                                                                            setAttributes({items});
                                                                        } else {
                                                                            this.onChangePropertyItem('isAllDays', false, currentItem.key)
                                                                        }
                                                                    }}
                                                                />
                                                                <br/>
                                                                <div className="kp-content-select">
                                                                    <BaseControl
                                                                        id="textarea-1"
                                                                        label={__('Select color', 'kenzap-timetable')}
                                                                    >
                                                                        <PanelColorSettings
                                                                            title={__('Color', 'kenzap-timetable')}
                                                                            initialOpen={false}
                                                                            colorSettings={[
                                                                                {
                                                                                    value: currentItem.color,
                                                                                    onChange: (titleColor) => {
                                                                                        this.onChangePropertyItem('color', titleColor, currentItem.key);
                                                                                    },
                                                                                    label: __('Background color', 'kenzap-timetable'),
                                                                                },
                                                                            ]}
                                                                        />
                                                                    </BaseControl>
                                                                </div>
                                                            </div>
                                                        </Popover>
                                                        }
                                                    </li>
                                                );
                                            }
                                            return (<li key={headerItem.value} className="">
                                                <button className="addItem"
                                                        onClick={() => this.addItem(headerItem.value, row.value)}>
                                                    <Plus/></button>
                                            </li>);
                                        })}
                                        <li className="deleteRow"
                                            onClick={() => this.deleteRow(index)}>{__('Delete row', 'kenzap-timetable')}</li>
                                    </ul>
                                ))}
                                <div className="addRow" onClick={this.addRow}>Add row</div>
                            </div>

                            <div className="kp-mobile">
                                {attributes.headerItems.map(headerItem => (
                                    <ul key={headerItem.value}>
                                        <li>{headerItem.name}</li>
                                        {attributes.rows.map(row => {
                                            const currentItem = attributes.items.find(item => item.row === row.value && item.header === headerItem.value);
                                            if (currentItem) {
                                                return (
                                                    <li key={row.value} className={currentItem.color}>
                                                        <span>{currentItem.period}
                                                            <strong>{currentItem.name}</strong></span>
                                                    </li>
                                                );
                                            }
                                            return null;
                                        })}
                                    </ul>
                                ))}
                            </div>
                        </div>
                    </ContainerEdit>
                </div>
            </div>
        );
    }
}
