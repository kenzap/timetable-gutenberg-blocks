const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { RichText, InspectorControls, PanelColorSettings } = wp.editor;
const { RangeControl, PanelBody, Popover, TextControl, ToggleControl, Button, CheckboxControl, BaseControl } = wp.components;

import { defaultItem, getStyles, typographyArr } from './block';
import { InspectorContainer, ContainerEdit } from '../commonComponents/container/container';
import { getTypography, TypographyContainer } from '../commonComponents/typography/typography';
import { Plus } from '../commonComponents/icons/plus';

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
        isModalActive: false,
        addPopup: {
            visibleForHeader: '',
        },
    };

    componentDidMount() {
        window.isTimeFree = this.isTimeFree;
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("kp-timetable-2:init", { detail: '' })
            );
        })
    }

    isTimeFree = (start, finish, header) => {
        const startTimeStamp = this.getScheduleTimestamp(start);
        const finishTimeStamp = this.getScheduleTimestamp(finish);
        const allItemsInHeader = this.props.attributes.items.filter(item =>
            (item.header === header && item.class === this.props.attributes.activeClass && item.month === this.props.attributes.activeMonth) &&
            (item.start <= startTimeStamp && item.finish > startTimeStamp)
        );
        return allItemsInHeader.length === 0;
    }


    /**
     * Add a new item to list with default fields
     */
    addItem = (header) => {
        key++;
        let selectedTime = {
            start: ``,
            finish: ``
        };
        const localKey = 'new ' + new Date().getTime();
        this.getRowsRangeArray().forEach(hour => {
            hour = hour.replace(':00', '');
            ['00', '05', 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].forEach(minutes => {
                const reservedTime = {
                    start: `${hour}:${minutes}`,
                    finish: `${(Number(minutes) + 15 === 60) ? Number(hour) + 1 : hour}:${(Number(minutes) + 15 === 60) ? 0 : Number(minutes) + 15}`
                };
                if (this.isTimeFree(reservedTime.start, reservedTime.finish, header) && (!selectedTime.start && !selectedTime.finish)) {
                    selectedTime = reservedTime;
                    if (selectedTime.start && selectedTime.finish) {
                        const newItem = {
                            ...defaultItem,
                            start: this.getScheduleTimestamp(selectedTime.start),
                            finish: this.getScheduleTimestamp(selectedTime.finish),
                            header: header,
                            class: this.props.attributes.activeClass,
                            month: this.props.attributes.activeMonth,
                            key: localKey,
                        };
                        this.setState({ addPopup: { ...this.state.addPopup, ...newItem, visibleForHeader: header } })
                        document.querySelector('.wp-block-kenzap-timetable-2').scrollTop = 0;
                    }
                }
            })
        });
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
        this.props.setAttributes({ items: items });
    };

    /**
     * Remove item
     * It also add default item if we remove all elements from array
     * @param {number} index - of item
     */
    removeItem = (key) => {
        const items = [...this.props.attributes.items];
        const index = items.findIndex(item => item.key === key);
        items.splice(index, 1);
        this.props.setAttributes({ items: items });
    };

    addColumn = () => {
        this.props.setAttributes({
            headerItems: [...this.props.attributes.headerItems, {
                name: __('Monday', 'kenzap-timetable'),
                value: 'new ' + new Date().getTime(),
            }],
        });
    };

    deleteColumn = (index) => {
        if (confirm(__('All courses related to this column will be removed. Continue?', 'kenzap-timetable'))) {
            const headerItems = [...this.props.attributes.headerItems];
            this.clearUselessItems({ type: 'header', value: headerItems[index].value });

            if (headerItems.length === 1) {
                this.props.setAttributes({
                    headerItems: [{
                        name: __('Monday', 'kenzap-timetable'),
                        value: 'new ' + new Date().getTime(),
                    }],
                });
                this.reInit();
            } else {
                headerItems.splice(index, 1);
                this.props.setAttributes({ headerItems });
                this.reInit();
            }
        }
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

        if (confirm(__('All courses related to this filter will be removed. Continue?', 'kenzap-timetable'))) {
            
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
        this.props.setAttributes({ items });
    };

    reInit = () => {
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("kp-timetable-2:init", { detail: '' })
            );
        });
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("kp-timetable-2:placeEvents", { detail: '' })
            );
        });
    }

    getScheduleTimestamp = (time) => {
        //accepts hh:mm format - convert hh:mm to timestamp
        time = time.replace(/ /g, '');
        var timeArray = time.split(':');
        // var timeStamp = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
        var timeStamp = new Date(1970, 0, 1, timeArray[0], timeArray[1]).getTime();
        return timeStamp;
    }

    getRowsRangeArray = () => {
        let rows = [];
        for (let i = this.props.attributes.rowsRange.from; i <= this.props.attributes.rowsRange.to; i++) {
            rows.push(`${i < 10 ? `0${i}` : i}:00`);
        }
        return rows;
    }

    isEventIsLittle = (item) => (item.finish - item.start) < 2400 * 1000;

    render() {
        const {
            className,
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const { vars, kenzapContanerStyles } = getStyles(attributes);

        const getActiveMonth = () => {
            const res = attributes.monthFilters.find(month => month.value === attributes.activeMonth)
            return res ? res.name : '';
        }

        window.dispatchEvent(
            new CustomEvent("kp-timetable-2:reset", { detail: '' })
        );

        const getFormattedTime = (time, hardcoded = false) => {
            time = Number(time);
            if (this.props.attributes.isPmAm && !hardcoded) {
                return new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }
            return `${("0" + new Date(time).getHours()).slice(-2)}:${("0" + new Date(time).getMinutes()).slice(-2)}`
        };

        const timeLineHeight = 80 * (this.getRowsRangeArray().length * 2 - 1);

        const EditPopup = (item, isAddAction = false) => (
            <Popover
                focusOnMount={false}
                className="kp-timetable-1-link-popover"
            >
                <i
                    onClick={() => {
                        if (isAddAction) {
                            this.setState({ addPopup: { ...this.state.addPopup, visibleForHeader: '' } });
                        } else {
                            this.setState({ popupVisibleIndex: -1 })
                        }
                    }}
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
                    <div className="kp-content-select">
                        <div>
                            <BaseControl
                                id="textarea-1"
                                label={__('Time start', 'kenzap-timetable')}
                            >
                                <select
                                    value={item.start}
                                    onChange={(event) => {
                                        if (isAddAction) {
                                            this.setState({
                                                addPopup: {
                                                    ...this.state.addPopup,
                                                    start: Number(event.target.value)
                                                }
                                            });
                                        } else {
                                            this.onChangePropertyItem('start', Number(event.target.value), item.key);
                                            this.reInit();
                                        }
                                    }}
                                >
                                    {this.getRowsRangeArray().map((hour, i) => {
                                        return ['00', '05', 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(minute => {
                                            if (Number(this.getScheduleTimestamp(hour.replace('00', minute))) + 300000 * 2 >= item.finish) {
                                                return null;
                                            }
                                            return ((
                                                <option
                                                    value={this.getScheduleTimestamp(hour.replace('00', minute))}
                                                    selected={item.start === this.getScheduleTimestamp(hour.replace('00', minute))}
                                                >
                                                    {getFormattedTime(this.getScheduleTimestamp(hour.replace('00', minute)))}
                                                </option>
                                            ));
                                        });
                                    }
                                    )}
                                </select>
                            </BaseControl>
                            <BaseControl
                                id="textarea-2"
                                label={__('Time end', 'kenzap-timetable')}
                            >
                                <select
                                    value={item.finish}
                                    onChange={(event) => {
                                        if (isAddAction) {
                                            this.setState({
                                                addPopup: {
                                                    ...this.state.addPopup,
                                                    finish: Number(event.target.value)
                                                }
                                            });
                                        } else {
                                            this.onChangePropertyItem('finish', Number(event.target.value), item.key);
                                            this.reInit();
                                        }
                                    }}
                                >
                                    {this.getRowsRangeArray().map((hour, i) => {
                                        if (this.getRowsRangeArray().length - 1 === i) {
                                            return (
                                                <option
                                                    value={this.getScheduleTimestamp(`${attributes.rowsRange.to}:00`)}
                                                    selected={item.finish === this.getScheduleTimestamp(`${attributes.rowsRange.to}:00`)}
                                                >
                                                    {getFormattedTime(this.getScheduleTimestamp(`${attributes.rowsRange.to}:00`))}
                                                </option>
                                            );
                                        }
                                        return ['00', '05', 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(minute => {
                                            if (this.getScheduleTimestamp(hour.replace('00', minute)) < item.start + 300000 * 3) {
                                                return null;
                                            }
                                            return (
                                                <option
                                                    value={this.getScheduleTimestamp(hour.replace('00', minute))}
                                                    selected={item.finish === this.getScheduleTimestamp(hour.replace('00', minute))}
                                                >
                                                    {getFormattedTime(this.getScheduleTimestamp(hour.replace('00', minute)))}
                                                </option>
                                            )
                                        })
                                    }
                                    )}
                                </select>
                            </BaseControl>
                        </div>
                        {isAddAction &&
                            <TextControl
                                label={__('Name', 'kenzap-timetable')}
                                placeholder={__('Name')}
                                value={item.name}
                                className="link-text"
                                onChange={(value) => {
                                    if (isAddAction) {
                                        this.setState({ addPopup: { ...this.state.addPopup, name: value } });
                                    } else {
                                        this.onChangePropertyItem('name', value, item.key);
                                    }
                                }}
                            />
                        }
                        {(this.isEventIsLittle(item) || isAddAction) &&
                            <TextControl
                                label={__('Teacher', 'kenzap-timetable')}
                                placeholder={__('Teacher')}
                                value={item.teacher}
                                className="link-text"
                                onChange={(value) => {
                                    if (isAddAction) {
                                        this.setState({ addPopup: { ...this.state.addPopup, teacher: value } });
                                    } else {
                                        this.onChangePropertyItem('teacher', value, item.key);
                                    }
                                }}
                            />
                        }
                        <PanelColorSettings
                            title={__('Colors', 'kenzap-timetable')}
                            initialOpen={false}
                            colorSettings={[
                                {
                                    value: item.color,
                                    onChange: (value) => {
                                        if (isAddAction) {
                                            this.setState({ addPopup: { ...this.state.addPopup, color: value } });
                                        } else {
                                            this.onChangePropertyItem('color', value, item.key);
                                        }
                                    },
                                    label: __('Background color', 'kenzap-timetable'),
                                },
                            ]}
                        />
                        {isAddAction &&
                            <Button style={{ width: '100%' }} isPrimary onClick={() => {
                                this.props.setAttributes({
                                    items: [...this.props.attributes.items, {
                                        ...defaultItem,
                                        name: this.state.addPopup.name,
                                        teacher: this.state.addPopup.teacher,
                                        start: this.state.addPopup.start,
                                        finish: this.state.addPopup.finish,
                                        header: this.state.addPopup.header,
                                        color: this.state.addPopup.color,
                                        class: this.props.attributes.activeClass,
                                        month: this.props.attributes.activeMonth,
                                        key: this.state.addPopup.key,
                                    }],
                                });
                                this.reInit();
                                this.setState({
                                    addPopup: {
                                        visibleForHeader: '',
                                    }
                                });
                            }}>
                                {__('Add event', 'kenzap-timetable')}
                            </Button>
                        }
                    </div>
                </div>
            </Popover>
        )

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
                                setAttributes({ isFilterShow });
                            }}
                        />

                        <CheckboxControl
                            label={__('CTA button', 'kenzap-timetable')}
                            checked={attributes.topAction.isShow}
                            onChange={(isShow) => {
                                setAttributes({ topAction: { ...attributes.topAction, isShow } });
                            }}
                        />

                        <CheckboxControl
                            label={__('AM/PM time', 'kenzap-timetable')}
                            checked={attributes.isPmAm}
                            onChange={(isPmAm) => {
                                setAttributes({ isPmAm });
                            }}
                        />

                        <RangeControl
                            label={__('Time start', 'kenzap-timetable')}
                            value={attributes.rowsRange.from}
                            onChange={(from) => {
                                setAttributes({
                                    rowsRange: { ...attributes.rowsRange, from: from }
                                })
                                this.forceUpdate();
                                this.reInit();
                            }}
                            min={0}
                            max={attributes.rowsRange.to - 1}
                        />
                        <RangeControl
                            label={__('Time end', 'kenzap-timetable')}
                            value={attributes.rowsRange.to}
                            onChange={(to) => {
                                setAttributes({
                                    rowsRange: { ...attributes.rowsRange, to: to }
                                });
                                this.forceUpdate();
                                this.reInit();
                            }}
                            min={attributes.rowsRange.from}
                            max={24}
                        />

                        <BaseControl
                            id="Manage-filters-1"
                        >
                            {['classFilters', 'monthFilters'].map(filterType => {
                                return (
                                    <div style={{ marginBottom: '25px' }}>
                                        <div style={{ marginBottom: '8px' }}><b>{filterType === 'classFilters' ? __('Filters', 'kenzap-timetable') : __('Months', 'kenzap-timetable')}</b></div>
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
                                                        style={{ lineHeight: 1, cursor: 'pointer', marginRight: '5px' }}
                                                        className="dashicons dashicons-no" />

                                                    <RichText
                                                        tag="span"
                                                        value={filter.name}
                                                        onChange={(value) => {
                                                            const filters = [...attributes[filterType]];
                                                            filters[index].name = value;
                                                            setAttributes({ [filterType]: filters });
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
                                            <span style={{ lineHeight: 1, marginRight: '5px' }}><Plus /></span>
                                            <span>{__('Add new filter', 'kenzap-timetable')}</span>
                                        </div>
                                    </div>
                                )
                            }
                            )}

                        </BaseControl>
                        
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
                <div className={`${className ? className : ''} `} style={{ ...vars, overflowX: 'scroll' }}>
                    <ContainerEdit
                        className={`kp-timetable-1 kenzap-lg ${isSelected ? 'selected' : ''} `}
                        attributes={attributes}
                        withBackground
                        withPadding
                    >
                        <div className="kenzap-container admin" style={{ backgroundColor: attributes.backgroundColor, ...kenzapContanerStyles, minWidth: '1280px' }}>
                            <div className="kp-nav">
                                {attributes.isFilterShow && <ul>
                                    {attributes.classFilters.map((filter, index) => (
                                        <li className="tab-link">
                                            <a
                                                onClick={() => {
                                                    if (this.props.attributes.activeClass !== filter.value) {
                                                        setAttributes({ activeClass: filter.value });
                                                        this.reInit();
                                                    }
                                                }}
                                                href={`#class-${index}`}
                                                style={getTypography(attributes, 0)}
                                            >
                                                {filter.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                }
                                {attributes.topAction.isShow &&
                                    <div className="">
                                        <a href="#" className="modal-link"
                                            onClick={() => this.setState({ isModalActive: true })}>
                                            <RichText
                                                tagName="span"
                                                value={this.props.attributes.topAction.title}
                                                onChange={(value) => {
                                                    setAttributes({ topAction: { ...this.props.attributes.topAction, title: value } });
                                                }}
                                                style={getTypography(attributes, 1)}
                                            />
                                        </a>
                                        {this.state.isModalActive && (
                                            <Popover
                                                focusOnMount={false}
                                                className="kp-timetable-1-link-popover"
                                            >
                                                <i
                                                    onClick={() => this.setState({ isModalActive: false })}
                                                    style={{
                                                        lineHeight: 1,
                                                        cursor: 'pointer',
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                    }}
                                                    className="dashicons dashicons-no"
                                                />
                                                <div>
                                                    <div style={{ marginBottom: '5px' }}>
                                                        <TextControl
                                                            label={__('Specify Link', 'kenzap-timetable')}
                                                            placeholder={__('http://www.example.com')}
                                                            value={this.props.attributes.topAction.link}
                                                            className="link-text"
                                                            onChange={(value) => {
                                                                setAttributes({
                                                                    topAction: {
                                                                        ...this.props.attributes.topAction,
                                                                        link: value
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                        <ToggleControl
                                                            label={__('Settings')}
                                                            help={this.props.attributes.topAction.linkTarget ? __('Open link in new window.', 'kenzap-timetable') : __('Open link in current window', 'kenzap-timetable')}
                                                            checked={this.props.attributes.topAction.linkTarget}
                                                            onChange={(value) => {
                                                                setAttributes({
                                                                    topAction: {
                                                                        ...this.props.attributes.topAction,
                                                                        linkTarget: value
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </Popover>
                                        )}
                                    </div>
                                }

                            </div>

                            <div className="kp-content">
                                <div className="tab-content active">
                                    <div className="owl-carousel owl-loaded">
                                        <div className="kp-box">
                                            <h3 className="month-title" style={getTypography(attributes, 2)}>
                                                <a
                                                    onClick={() => {
                                                        setAttributes({
                                                            activeMonth: attributes.monthFilters[
                                                                attributes.monthFilters.findIndex(month => month.value === this.props.attributes.activeMonth) - 1
                                                            ].value,
                                                        });
                                                        this.reInit();
                                                    }}
                                                    href="#"
                                                    style={{
                                                        display: attributes.monthFilters[
                                                            attributes.monthFilters.findIndex(month => month.value === this.props.attributes.activeMonth) - 1
                                                        ] ? 'block' : 'none',
                                                    }}
                                                    className="month-prev"
                                                />
                                                {getActiveMonth()}
                                                <a
                                                    onClick={() => {
                                                        setAttributes({
                                                            activeMonth: attributes.monthFilters[
                                                                attributes.monthFilters.findIndex(month => month.value === this.props.attributes.activeMonth) + 1
                                                            ].value,
                                                        });
                                                        this.reInit();
                                                    }}
                                                    href="#"
                                                    style={{
                                                        display: attributes.monthFilters[
                                                            attributes.monthFilters.findIndex(month => month.value === this.props.attributes.activeMonth) + 1
                                                        ] ? 'block' : 'none',
                                                    }}
                                                    className="month-next"
                                                />
                                            </h3>
                                            <div className="kp-schedule">
                                                <div className="timeline">
                                                    <ul>
                                                        {this.getRowsRangeArray().map((row, index) => (
                                                            <Fragment>
                                                                <li key={row} data-time={row}>
                                                                    <span style={getTypography(attributes, 3)}>{getFormattedTime(this.getScheduleTimestamp(row))}</span>
                                                                </li>
                                                                <li key={`${row}30`}
                                                                    data-time={row.replace(':00', ':30')}>
                                                                    <span style={getTypography(attributes, 3)}>{getFormattedTime(this.getScheduleTimestamp(row.replace(':00', ':30')))}</span>
                                                                </li>
                                                            </Fragment>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="events">
                                                    <ul>
                                                        <li className="events-group">
                                                            <div className="top-info"><span style={getTypography(attributes, 4)}>Time</span>
                                                            </div>
                                                            <ul>
                                                                <li></li>
                                                            </ul>
                                                        </li>

                                                        {attributes.headerItems.map((header, index) => (
                                                            <li className="events-group" key={header.value}>
                                                                <div className="top-info">
                                                                    <button className="remove"
                                                                        onClick={() => this.deleteColumn(index)}>
                                                                        <i className="dashicons dashicons-no" />
                                                                    </button>
                                                                    <RichText
                                                                        tagName="span"
                                                                        value={header.name}
                                                                        onChange={(value) => {
                                                                            const headerItems = [...attributes.headerItems];
                                                                            headerItems[index].name = value;
                                                                            setAttributes({ headerItems });
                                                                        }}
                                                                        style={getTypography(attributes, 4)}
                                                                    />
                                                                </div>

                                                                <ul style={{ height: `${timeLineHeight}px` }}>
                                                                    <li
                                                                        className="addNewEvent"
                                                                        onClick={() => this.addItem(header.value)}
                                                                    >
                                                                        <span
                                                                            className="text">{__('Add new event', 'kenzap-timetable')}</span>
                                                                    </li>
                                                                    {attributes.items.map(item => {
                                                                        if (item.header === header.value &&
                                                                            item.class === attributes.activeClass &&
                                                                            item.month === attributes.activeMonth)
                                                                            return (
                                                                                <li
                                                                                    className={`single-event ${this.isEventIsLittle(item) ? 'smallEvent' : ''}`}
                                                                                    data-start={getFormattedTime(item.start, true)}
                                                                                    data-end={getFormattedTime(item.finish, true)}
                                                                                    style={{ background: item.color ? item.color : '#75bdeb' }}
                                                                                >
                                                                                    <button
                                                                                        className="remove"
                                                                                        onClick={() => this.removeItem(item.key)}>
                                                                                        <i className="dashicons dashicons-no" />
                                                                                    </button>
                                                                                    <a
                                                                                        href="#"
                                                                                        onClick={() => this.setState({ popupVisibleIndex: item.key })}
                                                                                    >
                                                                                        <span
                                                                                            className="event-date" style={getTypography(attributes, 5)}>{getFormattedTime(item.start)} - {getFormattedTime(item.finish)}</span>
                                                                                        <p className="event-name">
                                                                                            <RichText
                                                                                                tagName="span"
                                                                                                value={item.name}
                                                                                                onChange={(value) => this.onChangePropertyItem('name', value, item.key)}
                                                                                                style={getTypography(attributes, 6)}
                                                                                            />
                                                                                            <RichText
                                                                                                tagName="em"
                                                                                                value={item.teacher}
                                                                                                onChange={(value) => this.onChangePropertyItem('teacher', value, item.key)}
                                                                                                style={getTypography(attributes, 7)}
                                                                                            />
                                                                                        </p>
                                                                                    </a>
                                                                                    {this.state.popupVisibleIndex === item.key && EditPopup(item)}
                                                                                </li>
                                                                            )
                                                                        return null;
                                                                    })}
                                                                    {this.state.addPopup.visibleForHeader === header.value && EditPopup(this.state.addPopup, true)}
                                                                </ul>
                                                            </li>
                                                        ))}
                                                        <li className="events-group"
                                                            style={{ cursor: 'pointer' }}>
                                                            <div className="top-info">
                                                                <span onClick={this.addColumn}><Plus /></span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ContainerEdit>
                </div>
            </div>
        );
    }
}
