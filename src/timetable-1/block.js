//  Import CSS.
import './style.scss';
import './editor.scss';

const {__} = wp.i18n;
const {registerBlockType} = wp.blocks;
const {RichText} = wp.editor;

import {blockProps, ContainerSave} from '../commonComponents/container/container';
import Edit from './edit';
import {getTypography} from '../commonComponents/typography/typography';

/**
 * Provides the initial data for new block
 */
export const defaultItem = {
    name: __('DESIGN', 'kenzap-timetable'),
    color: '#f58c04',
    period: __('11am-12pm', 'kenzap-timetable'),
    row: 'row3',
    header: 'header5',
    class: 'classFilter1',
    month: 'monthFilter1',
};

export const defaultSubBlocks = JSON.stringify([
    // header 1
    {
        name: __('MATHEMATHICS', 'kenzap-timetable'),
        color: '#39b54a',
        period: __('9am-10am', 'kenzap-timetable'),
        row: 'row1',
        header: 'header1',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 1,
    },
    {
        name: __('ENGLISH', 'kenzap-timetable'),
        color: '#733d96',
        period: __('10am-11am', 'kenzap-timetable'),
        row: 'row2',
        header: 'header1',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 2,
    },
    {
        name: __('PSYCHOLOGY', 'kenzap-timetable'),
        color: '#0f4ea3',
        period: __('11am-12pm', 'kenzap-timetable'),
        row: 'row3',
        header: 'header1',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 3,
    },
    {
        name: __('LUNCH BREAK', 'kenzap-timetable'),
        color: '#a6b5d4',
        period: __('12pm-1pm', 'kenzap-timetable'),
        row: 'row4',
        header: 'header1',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: true,
        key: new Date().getTime() + 4,
    },
    {
        name: __('DESIGN', 'kenzap-timetable'),
        color: '#f58c04',
        period: __('1pm-2pm', 'kenzap-timetable'),
        row: 'row5',
        header: 'header1',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 5,
    },
    {
        name: __('MATHEMATHICS', 'kenzap-timetable'),
        color: '#39b54a',
        period: __('2pm-3pm', 'kenzap-timetable'),
        row: 'row6',
        header: 'header1',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 6,
    },
    {
        name: __('ENGLISH', 'kenzap-timetable'),
        color: '#733d96',
        period: __('3pm-4pm', 'kenzap-timetable'),
        row: 'row7',
        header: 'header1',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 7,
    },
    {
        name: __('PSYCHOLOGY', 'kenzap-timetable'),
        color: '#0f4ea3',
        period: __('4pm-5pm', 'kenzap-timetable'),
        row: 'row8',
        header: 'header1',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 8,
    },
    // header 2
    {
        name: __('BIOLOGY', 'kenzap-timetable'),
        color: '#ed145b',
        period: __('9am-10am', 'kenzap-timetable'),
        row: 'row1',
        header: 'header2',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 9,
    },
    {
        name: __('DESIGN', 'kenzap-timetable'),
        color: '#f58c04',
        period: __('10am-11am', 'kenzap-timetable'),
        row: 'row2',
        header: 'header2',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 10,
    },
    {
        name: __('ENGLISH', 'kenzap-timetable'),
        color: '#733d96',
        period: __('11am-12pm', 'kenzap-timetable'),
        row: 'row3',
        header: 'header2',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 11,
    },
    {
        name: __('MATHEMATHICS', 'kenzap-timetable'),
        color: '#39b54a',
        period: __('1pm-2pm', 'kenzap-timetable'),
        row: 'row5',
        header: 'header2',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 12,
    },
    {
        name: __('BIOLOGY', 'kenzap-timetable'),
        color: '#ed145b',
        period: __('2pm-3pm', 'kenzap-timetable'),
        row: 'row6',
        header: 'header2',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 13,
    },
    {
        name: __('DESIGN', 'kenzap-timetable'),
        color: '#f58c04',
        period: __('3pm-4pm', 'kenzap-timetable'),
        row: 'row7',
        header: 'header2',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 14,
    },
    {
        name: __('ENGLISH', 'kenzap-timetable'),
        color: '#733d96',
        period: __('4pm-5pm', 'kenzap-timetable'),
        row: 'row8',
        header: 'header2',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 15,
    },
    // header 3
    {
        name: __('DESIGN', 'kenzap-timetable'),
        color: '#f58c04',
        period: __('9am-10am', 'kenzap-timetable'),
        row: 'row1',
        header: 'header3',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 16,
    },
    {
        name: __('MATHEMATHICS', 'kenzap-timetable'),
        color: '#39b54a',
        period: __('10am-11am', 'kenzap-timetable'),
        row: 'row2',
        header: 'header3',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 17,
    },
    {
        name: __('BIOLOGY', 'kenzap-timetable'),
        color: '#ed145b',
        period: __('11am-12pm', 'kenzap-timetable'),
        row: 'row3',
        header: 'header3',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 18,
    },
    {
        name: __('ENGLISH', 'kenzap-timetable'),
        color: '#733d96',
        period: __('1pm-2pm', 'kenzap-timetable'),
        row: 'row5',
        header: 'header3',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 19,
    },
    {
        name: __('DESIGN', 'kenzap-timetable'),
        color: '#f58c04',
        period: __('2pm-3pm', 'kenzap-timetable'),
        row: 'row6',
        header: 'header3',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 20,
    },
    {
        name: __('MATHEMATHICS', 'kenzap-timetable'),
        color: '#39b54a',
        period: __('3pm-4pm', 'kenzap-timetable'),
        row: 'row7',
        header: 'header3',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 21,
    },
    {
        name: __('BIOLOGY', 'kenzap-timetable'),
        color: '#ed145b',
        period: __('4pm-5pm', 'kenzap-timetable'),
        row: 'row8',
        header: 'header3',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 22,
    },
    //header 4
    {
        name: __('ENGLISH', 'kenzap-timetable'),
        color: '#733d96',
        period: __('9am-10am', 'kenzap-timetable'),
        row: 'row1',
        header: 'header4',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 23,
    },
    {
        name: __('PSYCHOLOGY', 'kenzap-timetable'),
        color: '#0f4ea3',
        period: __('10am-11am', 'kenzap-timetable'),
        row: 'row2',
        header: 'header4',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 24,
    },
    {
        name: __('MATHEMATHICS', 'kenzap-timetable'),
        color: '#39b54a',
        period: __('11am-12pm', 'kenzap-timetable'),
        row: 'row3',
        header: 'header4',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 25,
    },
    {
        name: __('BIOLOGY', 'kenzap-timetable'),
        color: '#ed145b',
        period: __('1pm-2pm', 'kenzap-timetable'),
        row: 'row5',
        header: 'header4',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 26,
    },
    {
        name: __('ENGLISH', 'kenzap-timetable'),
        color: '#733d96',
        period: __('2pm-3pm', 'kenzap-timetable'),
        row: 'row6',
        header: 'header4',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 27,
    },
    {
        name: __('PSYCHOLOGY', 'kenzap-timetable'),
        color: '#0f4ea3',
        period: __('3pm-4pm', 'kenzap-timetable'),
        row: 'row7',
        header: 'header4',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 28,
    },
    {
        name: __('MATHEMATHICS', 'kenzap-timetable'),
        color: '#39b54a',
        period: __('4pm-5pm', 'kenzap-timetable'),
        row: 'row8',
        header: 'header4',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 29,
    },
    // header 5
    {
        name: __('PSYCHOLOGY', 'kenzap-timetable'),
        color: '#0f4ea3',
        period: __('9am-10am', 'kenzap-timetable'),
        row: 'row1',
        header: 'header5',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 30,
    },
    {
        name: __('BIOLOGY', 'kenzap-timetable'),
        color: '#ed145b',
        period: __('10am-11am', 'kenzap-timetable'),
        row: 'row2',
        header: 'header5',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 31,
    },
    {
        name: __('DESIGN', 'kenzap-timetable'),
        color: '#f58c04',
        period: __('11am-12pm', 'kenzap-timetable'),
        row: 'row3',
        header: 'header5',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 32,
    },
    {
        name: __('PSYCHOLOGY', 'kenzap-timetable'),
        color: '#0f4ea3',
        period: __('1pm-2pm', 'kenzap-timetable'),
        row: 'row5',
        header: 'header5',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 33,
    },
    {
        name: __('PSYCHOLOGY', 'kenzap-timetable'),
        color: '#0f4ea3',
        period: __('2pm-3pm', 'kenzap-timetable'),
        row: 'row6',
        header: 'header5',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 34,
    },
    {
        name: __('BIOLOGY', 'kenzap-timetable'),
        color: '#ed145b',
        period: __('3pm-4pm', 'kenzap-timetable'),
        row: 'row7',
        header: 'header5',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 35,
    },
    {
        name: __('DESIGN', 'kenzap-timetable'),
        color: '#f58c04',
        period: __('4pm-5pm', 'kenzap-timetable'),
        row: 'row8',
        header: 'header5',
        class: 'classFilter1',
        month: 'monthFilter1',
        isAllDays: false,
        key: new Date().getTime() + 36,
    },
]);

export const defaultClassFilters = [
    {
        name: __('Class XI', 'kenzap-timetable'),
        value: 'classFilter1',
    }, {
        name: __('Class XII', 'kenzap-timetable'),
        value: 'classFilter2',
    }, {
        name: __('Class XIII', 'kenzap-timetable'),
        value: 'classFilter3',
    },
];

export const defaultMonthFilters = [
    {
        name: __('July', 'kenzap-timetable'),
        value: 'monthFilter1',
    }, {
        name: __('August', 'kenzap-timetable'),
        value: 'monthFilter2',
    }, {
        name: __('September', 'kenzap-timetable'),
        value: 'monthFilter3',
    },
];

export const defaultHeaders = [
    {
        name: __('MONDAY', 'kenzap-timetable'),
        value: 'header1',
    },
    {
        name: __('TUESDAY', 'kenzap-timetable'),
        value: 'header2',
    },
    {
        name: __('WEDNESDAY', 'kenzap-timetable'),
        value: 'header3',
    },
    {
        name: __('THURSDAY', 'kenzap-timetable'),
        value: 'header4',
    },
    {
        name: __('FRIDAY', 'kenzap-timetable'),
        value: 'header5',
    },
];

export const defaultRows = [
    {
        name: __('9am', 'kenzap-timetable'),
        value: 'row1',
    },
    {
        name: __('10am', 'kenzap-timetable'),
        value: 'row2',
    },
    {
        name: __('11am', 'kenzap-timetable'),
        value: 'row3',
    },
    {
        name: __('12pm', 'kenzap-timetable'),
        value: 'row4',
    },
    {
        name: __('1pm', 'kenzap-timetable'),
        value: 'row5',
    },
    {
        name: __('2pm', 'kenzap-timetable'),
        value: 'row6',
    },
    {
        name: __('3pm', 'kenzap-timetable'),
        value: 'row7',
    },
    {
        name: __('4pm', 'kenzap-timetable'),
        value: 'row8',
    },
];

/**
 * Define typography defaults
 */
export const typographyArr = JSON.stringify([
    {
        'title': __('- Headers', 'kenzap-timetable'),
        'font-size': 16,
    },
    {
        'title': __('- Time', 'kenzap-timetable'),
        'font-size': 16,
        'margin-bottom': 12,
    },
    {
        'title': __('- Title', 'kenzap-timetable'),
        'font-size': 16,
    },
    {
        'title': __('- Filters', 'kenzap-timetable'),
        'margin-top': 25,
        'margin-right': 15,
        'margin-bottom': 25,
        'margin-left': 15,
    },
]);

/**
 * Generate inline styles for custom settings of the block
 * @param {Object} attributes - of the block
 * @returns {Node} generated styles
 */
export const getStyles = attributes => {
    const kenzapContanerStyles = {
        maxWidth: `${ attributes.containerMaxWidth === '100%' ? '100%' : attributes.containerMaxWidth + 'px' }`,
        '--maxWidth': `${ attributes.containerMaxWidth === '100%' ? '100vw' : attributes.containerMaxWidth + ' ' } `,
    };

    const vars = {
        '--paddings': `${ attributes.containerPadding }`,
        '--paddings2': `${ attributes.containerSidePadding }px`,
        '--filtersSize': `${ attributes.filtersSize }px`,
        '--descriptionAndFiltersColor': attributes.descriptionAndFiltersColor,
        '--titleColor': attributes.titleColor,
    };

    return {
        vars,
        kenzapContanerStyles,
    };
};

export const attrs = {
    ...blockProps,

    isFilterShow: {
        type: 'boolean',
        default: true,
    },

    headerItems: {
        type: 'array',
        default: [],
    },

    items: {
        type: 'array',
        default: [],
    },

    classFilters: {
        type: 'array',
        default: [],
    },

    monthFilters: {
        type: 'array',
        default: [],
    },

    rows: {
        type: 'array',
        default: [],
    },

    activeClass: {
        type: 'string',
        default: 'classFilter1',
    },

    activeMonth: {
        type: 'string',
        default: 'monthFilter1',
    },

    typography: {
        type: 'array',
        default: [],
    },

    isFirstLoad: {
        type: 'boolean',
        default: true,
    },
};

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('kenzap/timetable-1', {
    title: __('Kenzap Timetable 1', 'kenzap-timetable'),
    icon: 'media-spreadsheet',
    category: 'layout',
    keywords: [
        __('timetable', 'kenzap-timetable'),
    ],
    anchor: true,
    html: true,
    attributes: attrs,
    supports: {
        align: ['full', 'wide'],
    },

    edit: (props) => {
        if (props.attributes.items.length === 0 && props.attributes.isFirstLoad) {
            props.setAttributes({
                items: [...JSON.parse(defaultSubBlocks)],
                headerItems: [...defaultHeaders],
                classFilters: [...defaultClassFilters],
                monthFilters: [...defaultMonthFilters],
                rows: [...defaultRows],
                isFirstLoad: false,
            });
        }
        Object.keys(props.attributes).forEach(attr => {
            if (typeof props.attributes[attr] === 'undefined') {
                props.attributes[attr] = attrs[attr].default;
            }
        });
        return (<Edit {...props} />);
    },

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     * @param {Object} props - attributes
     * @returns {Node} rendered component
     */
    save: function (props) {
        const {
            className,
            attributes,
        } = props;

        Object.keys(attributes).forEach(attr => {
            if (typeof attributes[attr] === 'undefined') {
                attributes[attr] = attrs[attr].default;
            }
        });

        const {vars, kenzapContanerStyles} = getStyles(props.attributes);

        const isOneItem = (row, month, classFilter) =>
            attributes.items.filter(item =>
                item.row === row &&
                item.month === month &&
                item.class === classFilter
            ).find(i => i.isAllDays === true);

        const desktopContent = (month, classFilter) => (
            <div
                className={`kp-content ${month}_${classFilter} ${month === attributes.activeMonth && classFilter === attributes.activeClass ? 'active' : ''}`}>
                {attributes.rows.map((row) => (
                    <ul key={row.value}>
                        <li style={getTypography(attributes, 0)}>{row.name}</li>
                        {attributes.headerItems.map((headerItem, index) => {
                            const isOneItemOnRow = isOneItem(row.value, month, classFilter);

                            if (isOneItemOnRow && index !== 0) {
                                return null;
                            }

                            const currentItem = attributes.items.find(
                                item => item.row === row.value &&
                                    item.header === headerItem.value &&
                                    item.month === month &&
                                    item.class === classFilter
                            );
                            if (currentItem) {
                                return (
                                    <li key={headerItem.value}
                                        className={`${isOneItemOnRow ? `break day-${attributes.headerItems.length}` : ''}`}>
                                                    <span style={{background: currentItem.color}}>
                                                        <RichText.Content
                                                            tagName="p"
                                                            value={currentItem.period}
                                                            style={getTypography(attributes, 1)}
                                                        />
                                                        <RichText.Content
                                                            tagName="strong"
                                                            className="kp-name"
                                                            style={getTypography(attributes, 2)}
                                                            value={currentItem.name}
                                                        />
                                                    </span>
                                    </li>
                                );
                            }
                            return (<li key={headerItem.value} className=""><span/></li>);
                        })}
                    </ul>
                ))}
            </div>
        );

        const mobileContent = (month, classFilter) => (
            <div
                className={`kp-mobile ${month}_${classFilter} ${month === attributes.activeMonth && classFilter === attributes.activeClass ? 'active' : ''}`}>
                {attributes.headerItems.map(headerItem => (
                    <ul key={headerItem.value}>
                        <li style={getTypography(attributes, 0)}>{headerItem.name}</li>
                        {attributes.rows.map(row => {
                            let currentItem = attributes.items.find(
                                item => item.row === row.value &&
                                    item.header === headerItem.value &&
                                    item.month === month &&
                                    item.class === classFilter
                            );

                            if(!currentItem) {
                                currentItem = isOneItem(row.value, month, classFilter);
                            }

                            if (currentItem) {
                                return (
                                    <li key={row.value} className={currentItem.color}>
                                                    <span style={{background: currentItem.color}}>
                                                        <RichText.Content
                                                            tagName="p"
                                                            value={currentItem.period}
                                                            style={getTypography(attributes, 1)}
                                                        />
                                                        <RichText.Content
                                                            tagName="p"
                                                            className="kp-name"
                                                            style={getTypography(attributes, 2)}
                                                            value={currentItem.name}
                                                        />
                                                    </span>
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>
                ))}
            </div>
        )

        return (
            <div className={className ? className : ''} style={vars}>
                <ContainerSave
                    className={'kp-timetable-2'}
                    attributes={attributes}
                    style={vars}
                    withBackground
                    withPadding
                >
                    <script>
                        var items = {JSON.stringify(attributes.items)};
                    </script>
                    <div className="kenzap-container" style={kenzapContanerStyles}>
                        <div className="kp-table">
                            {attributes.isFilterShow && <ul className="kp-filter">
                                <select style={getTypography(attributes, 3)} value={attributes.activeClass}>
                                    {attributes.classFilters.map(filter => (
                                        <option selected={attributes.activeClass === filter.value} key={filter.value}
                                                value={filter.value}>{filter.name}</option>
                                    ))}
                                </select>
                                <select style={getTypography(attributes, 3)} value={attributes.activeMonth}>
                                    {attributes.monthFilters.map(filter => (
                                        <option selected={attributes.activeMonth === filter.value} key={filter.value}
                                                value={filter.value}>{filter.name}</option>
                                    ))}
                                </select>
                            </ul>
                            }
                        </div>

                        <div className="kp-header">
                            <ul>
                                <li style={getTypography(attributes, 0)} className="kp-clock-image"></li>
                                {attributes.headerItems.map(headerItem => (
                                    <li style={getTypography(attributes, 0)}
                                        key={headerItem.value}>{headerItem.name}</li>
                                ))}
                            </ul>
                        </div>

                        {desktopContent(attributes.activeMonth, attributes.activeClass)}

                        {attributes.monthFilters.map(month =>
                            attributes.classFilters.map(classFilter => {
                                if (month.value === attributes.activeMonth && classFilter.value === attributes.activeClass) {
                                    return null;
                                }

                                return desktopContent(month.value, classFilter.value);

                            })
                        )}

                        {mobileContent(attributes.activeMonth, attributes.activeClass)}

                        {attributes.monthFilters.map(month =>
                            attributes.classFilters.map(classFilter => {
                                if (month.value === attributes.activeMonth && classFilter.value === attributes.activeClass) {
                                    return null;
                                }

                                return mobileContent(month.value, classFilter.value);

                            })
                        )}

                    </div>
                </ContainerSave>
            </div>
        );
    },
});
