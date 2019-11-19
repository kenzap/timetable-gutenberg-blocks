//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;
const { Fragment } = wp.element;

import { blockProps, ContainerSave } from '../commonComponents/container/container';
import Edit from './edit';
import { getTypography } from '../commonComponents/typography/typography';

/**
 * Provides the initial data for new block
 */
export const defaultItem = {
    name: __('Hatha Yoga', 'kenzap-timetable'),
    teacher: __('Mantilla Doria', 'kenzap-timetable'),
    start: '9:00',
    finish: '10:45',
    header: 'header2',
    class: 'classFilter1',
    month: 'monthFilter1',
};

export const defaultSubBlocks = JSON.stringify([
    // header 1
    // header 2
    {
        name: __('Hatha Yoga', 'kenzap-timetable'),
        teacher: __('Mantilla Doria', 'kenzap-timetable'),
        start: new Date(1970, 0, 1, 9, 0).getTime(),
        finish: new Date(1970, 0, 1, 10, 45).getTime(),
        header: 'header2',
        class: 'classFilter1',
        month: 'monthFilter1',
        key: new Date().getTime() + 1,
    },
    // header 3
    {
        name: __('Hatha Yoga', 'kenzap-timetable'),
        teacher: __('Mantilla Doria', 'kenzap-timetable'),
        start: new Date(1970, 0, 1, 15, 30).getTime(),
        finish: new Date(1970, 0, 1, 17, 15).getTime(),
        header: 'header3',
        class: 'classFilter1',
        month: 'monthFilter1',
        key: new Date().getTime() + 2,
    },
    // header 4
    {
        name: __('Hatha Yoga', 'kenzap-timetable'),
        teacher: __('Mantilla Doria', 'kenzap-timetable'),
        start: new Date(1970, 0, 1, 11, 0).getTime(),
        finish: new Date(1970, 0, 1, 12, 45).getTime(),
        header: 'header4',
        class: 'classFilter1',
        month: 'monthFilter1',
        key: new Date().getTime() + 3,
    },
    // header 5
    // header 6
    {
        name: __('Hatha Yoga', 'kenzap-timetable'),
        teacher: __('Mantilla Doria', 'kenzap-timetable'),
        start: new Date(1970, 0, 1, 8, 30).getTime(),
        finish: new Date(1970, 0, 1, 10, 15).getTime(),
        header: 'header6',
        class: 'classFilter1',
        month: 'monthFilter1',
        key: new Date().getTime() + 4,
    },
    // header 7
    // header 1
    {
        name: __('Hatha Yoga', 'kenzap-timetable'),
        teacher: __('Mantilla Doria', 'kenzap-timetable'),
        start: new Date(1970, 0, 1, 8, 30).getTime(),
        finish: new Date(1970, 0, 1, 10, 15).getTime(),
        header: 'header1',
        class: 'classFilter1',
        month: 'monthFilter2',
        key: new Date().getTime() + 5,
    },
]);

export const defaultClassFilters = [
    {
        name: __('Hatha Yoga', 'kenzap-timetable'),
        value: 'classFilter1',
    }, {
        name: __('Dharma Yoga', 'kenzap-timetable'),
        value: 'classFilter2',
    }, {
        name: __('Cord Yoga', 'kenzap-timetable'),
        value: 'classFilter3',
    }, {
        name: __('Bikram Yoga', 'kenzap-timetable'),
        value: 'classFilter4',
    },
];

export const defaultMonthFilters = [
    {
        name: __('August', 'kenzap-timetable'),
        value: 'monthFilter1',
    }, {
        name: __('September', 'kenzap-timetable'),
        value: 'monthFilter2',
    },
];

export const defaultHeaders = [
    {
        name: __('Monday', 'kenzap-timetable'),
        value: 'header1',
    },
    {
        name: __('Tuesday', 'kenzap-timetable'),
        value: 'header2',
    },
    {
        name: __('Wednesday', 'kenzap-timetable'),
        value: 'header3',
    },
    {
        name: __('Thursday', 'kenzap-timetable'),
        value: 'header4',
    },
    {
        name: __('Friday', 'kenzap-timetable'),
        value: 'header5',
    },
    {
        name: __('Saturday', 'kenzap-timetable'),
        value: 'header6',
    },
    {
        name: __('Sunday', 'kenzap-timetable'),
        value: 'header7',
    },
];

/**
 * Define typography defaults
 */
export const typographyArr = JSON.stringify([
    {
        'title': __('- Filters', 'kenzap-timetable'),
    },
    {
        'title': __('- Button', 'kenzap-timetable'),
    },
    {
        'title': __('- Month', 'kenzap-timetable'),
    },
    {
        'title': __('- Time', 'kenzap-timetable'),
    },
    {
        'title': __('- Headers', 'kenzap-timetable'),
        'font-size': 18,
    },
    {
        'title': __('- Event time', 'kenzap-timetable'),
    },
    {
        'title': __('- Title', 'kenzap-timetable'),
    },
    {
        'title': __('- Teacher', 'kenzap-timetable'),
    },
]);

/**
 * Generate inline styles for custom settings of the block
 * @param {Object} attributes - of the block
 * @returns {Node} generated styles
 */
export const getStyles = attributes => {
    const kenzapContanerStyles = {
        maxWidth: `${attributes.containerMaxWidth === '100%' ? '100%' : attributes.containerMaxWidth + 'px'}`,
        '--maxWidth': `${attributes.containerMaxWidth === '100%' ? '100vw' : attributes.containerMaxWidth + ' '} `,
    };

    const vars = {
        '--paddings': `${attributes.containerPadding}`,
        '--paddings2': `${ attributes.containerSidePadding }px`,
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

    rowsRange: {
        type: 'object',
        default: {
            from: 8,
            to: 22,
        },
    },

    isPmAm: {
        type: 'boolean',
        default: false,
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

    topAction: {
        type: 'object',
        default: {
            title: __('Register for classes', 'kenzap-timetable'),
            link: '/',
            linkTarget: false,
            isShow: true,
        }
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
registerBlockType('kenzap/timetable-2', {
    title: __('Kenzap Timetable 2', 'kenzap-timetable'),
    icon: 'media-spreadsheet',
    category: 'layout',
    keywords: [
        __('timetable', 'kenzap-timetable'),
        __('timeline', 'kenzap-timetable'),
        __('courses', 'kenzap-timetable'),
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

        const { vars, kenzapContanerStyles } = getStyles(props.attributes);

        const getRowsRangeArray = () => {
            let rows = [];
            for (let i = attributes.rowsRange.from; i <= attributes.rowsRange.to; i++) {
                rows.push(`${i < 10 ? `0${i}` : i}:00`);
            }
            return rows;
        };

        const getFormattedTime = (time, hardcoded = false) => {
            time = Number(time);
            if (attributes.isPmAm && !hardcoded) {
                return new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }
            return `${("0" + new Date(time).getHours()).slice(-2)}:${("0" + new Date(time).getMinutes()).slice(-2)}`
        };

        const getScheduleTimestamp = (time) => {
            //accepts hh:mm format - convert hh:mm to timestamp
            time = time.replace(/ /g, '');
            var timeArray = time.split(':');
            // var timeStamp = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
            var timeStamp = new Date(1970, 0, 1, timeArray[0], timeArray[1]).getTime();
            return timeStamp;
        };

        const isEventIsLittle = (item) => (item.finish - item.start) < 2400 * 1000;
        const timeLineHeight = 80 * (getRowsRangeArray().length * 2 - 1);
        return (
            <div className={className ? className : ''} style={vars}>
                <ContainerSave
                    className={'kp-timetable-1'}
                    attributes={attributes}
                    style={vars}
                    withBackground
                    withPadding
                >
                    <div className="kenzap-container" style={{ ...kenzapContanerStyles, '--columnHeight': `${timeLineHeight}px`, }}>
                        <div className="kp-nav">
                            {attributes.isFilterShow && <ul>
                                {attributes.classFilters.map((filter, index) => (
                                    <li className="tab-link">
                                        <a style={getTypography(attributes, 0)} href={`#class-${index}`}>{filter.name}</a>
                                    </li>
                                ))}
                            </ul>
                            }
                            {attributes.topAction.isShow &&
                                <a
                                    href={attributes.topAction.link || 'javascript:void(0);'}
                                    className="modal-link"
                                    target={attributes.topAction.linkTarget ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    style={getTypography(attributes, 1)}
                                >
                                    <RichText.Content
                                        tagName="span"
                                        value={attributes.topAction.title}
                                    />
                                </a>
                            }
                        </div>

                        <div className="kp-content">
                            {attributes.classFilters.map((filter, fIndex) => (
                                <div id={`class-${fIndex}`} className={`tab-content ${fIndex === 0 ? 'active' : ''}`}>
                                    <div className="owl-carousel">
                                        {attributes.monthFilters.map((mFilter, mIndex) => (
                                            <div className="kp-box">
                                                <h3 className="month-title" style={getTypography(attributes, 2)}>
                                                    <a href="javascript:void(0);" className="month-prev"></a>
                                                    {mFilter.name}
                                                    <a href="javascript:void(0);" className="month-next"></a>
                                                </h3>
                                                <div className="kp-schedule loading">
                                                    <div className="timeline">
                                                        <ul>
                                                            {getRowsRangeArray().map((row, index) => (
                                                                <Fragment>
                                                                    <li key={row} data-time={row}>
                                                                        <span style={getTypography(attributes, 3)}>{getFormattedTime(getScheduleTimestamp(row))}</span>
                                                                    </li>
                                                                    <li  key={`${row}30`} data-time={row.replace(':00', ':30')}>
                                                                        <span style={getTypography(attributes, 3)}>{getFormattedTime(getScheduleTimestamp(row.replace(':00', ':30')))}</span>
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
                                                                        <RichText.Content
                                                                            tagName="span"
                                                                            value={header.name}
                                                                            style={getTypography(attributes, 4)}
                                                                        />
                                                                    </div>

                                                                    <ul>
                                                                        {attributes.items.map(item => {
                                                                            if (
                                                                                item.header === header.value &&
                                                                                item.class === filter.value &&
                                                                                item.month === mFilter.value
                                                                            )
                                                                                return (
                                                                                    <li
                                                                                        className={`single-event ${isEventIsLittle(item) ? 'smallEvent' : ''}`}
                                                                                        data-start={getFormattedTime(item.start, true)}
                                                                                        data-end={getFormattedTime(item.finish, true)}
                                                                                        style={{background: item.color ? item.color : '#75bdeb'}}
                                                                                    >
                                                                                        <a href="#">
                                                                                            <span className="event-date" style={getTypography(attributes, 5)} >{getFormattedTime(item.start)} - {getFormattedTime(item.finish)}</span>
                                                                                            <p className="event-name">
                                                                                                <RichText.Content
                                                                                                    tagName="span"
                                                                                                    value={item.name}
                                                                                                    style={getTypography(attributes, 6)}
                                                                                                />
                                                                                                <RichText.Content
                                                                                                    tagName="em"
                                                                                                    value={item.teacher}
                                                                                                    style={getTypography(attributes, 7)}
                                                                                                />
                                                                                            </p>
                                                                                        </a>
                                                                                    </li>
                                                                                );
                                                                            return null;
                                                                        })}
                                                                    </ul>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ContainerSave>
            </div>
        );
    },
});
