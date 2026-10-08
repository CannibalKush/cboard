import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';
import BoardGrid from './BoardGrid.component';
import Button from '@material-ui/core/Button';
import { Scannable } from 'react-scannable';
import BoardPagination from './BoardPagination';
import Grid from '../../Grid';
import FixedGrid from '../../FixedGrid';
import ScrollButtons from '../../ScrollButtons';

jest.unmock('react-intl');

const props = {
  board: {
    id: 'root',
    tiles: Array.from({ length: 30 }, (_, id) => ({
      id: String(id),
      label: String(id)
    }))
  },
  displaySettings: { uiSize: 'Standard' },
  navigationSettings: {
    boardNavigationMode: 'pagination',
    bigScrollButtonsActive: true
  },
  scannerSettings: { active: false },
  selectedTileIds: [],
  intl: { formatMessage: (message) => message.defaultMessage },
  boardContainerRef: { current: null },
  fixedBoardContainerRef: { current: null },
  navHistory: [],
  onTileClick: jest.fn(),
  onFocusTile: jest.fn(),
  onTileDrop: jest.fn(),
  onAddRemoveRow: jest.fn(),
  onAddRemoveColumn: jest.fn(),
  onLayoutChange: jest.fn()
};
it('paginates without giving the partial layout to the board-saving callback', () => {
  const wrapper = shallow(<BoardGrid {...props} />);
  expect(wrapper.find(Grid).prop('onLayoutChange')).toBeUndefined();
  expect(wrapper.find(Grid).prop('children')).toHaveLength(3);
  expect(wrapper.find(ScrollButtons)).toHaveLength(0);
  wrapper.find(BoardPagination).prop('onChange')(1);
  expect(wrapper.find(Grid).prop('children')[0].key).toBe('3');
});
it.each([undefined, 'scroll'])(
  'keeps all tiles and existing scroll behavior for %s mode',
  (mode) => {
    const wrapper = shallow(
      <BoardGrid
        {...props}
        navigationSettings={{
          ...props.navigationSettings,
          boardNavigationMode: mode
        }}
      />
    );
    expect(wrapper.find(BoardPagination)).toHaveLength(0);
    expect(wrapper.find(Grid).prop('children')).toHaveLength(30);
    expect(wrapper.find(Grid).prop('onLayoutChange')).toBe(
      props.onLayoutChange
    );
    expect(wrapper.find(ScrollButtons)).toHaveLength(1);
  }
);
it('edits the complete board, even when pagination is the preferred navigation mode', () => {
  const wrapper = shallow(<BoardGrid {...props} isSelecting />);
  expect(wrapper.find(BoardPagination)).toHaveLength(0);
  expect(wrapper.find(Grid).prop('children')).toHaveLength(30);
  expect(wrapper.find(Grid).prop('edit')).toBe(true);
  expect(wrapper.find(Grid).prop('onLayoutChange')).toBe(props.onLayoutChange);
});
it('selects existing fixed pages without slicing or rewriting their ordering', () => {
  const board = {
    ...props.board,
    isFixed: true,
    grid: { rows: 2, columns: 3, order: [['2', '1', '0']] }
  };
  const wrapper = shallow(<BoardGrid {...props} board={board} />);
  wrapper.find(BoardPagination).prop('onChange')(2);
  expect(wrapper.find(FixedGrid).prop('page')).toBe(2);
  expect(wrapper.find(FixedGrid).prop('items')).toBe(board.tiles);
  expect(wrapper.find(FixedGrid).prop('order')).toBe(board.grid.order);
});

it.each([0, 1, 2])(
  'page controls wrap from page %s in both directions',
  (page) => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <BoardPagination page={page} pageCount={3} onChange={onChange} />
    );
    const buttons = wrapper.find(Button);
    expect(buttons).toHaveLength(2);
    buttons.forEach((button) => {
      expect(button.prop('disabled')).toBe(false);
      expect(button.prop('color')).toBe('primary');
    });
    const labels = wrapper.find(FormattedMessage);
    expect(labels.at(0).prop('defaultMessage')).toBe(
      page === 0 ? 'Last page' : 'Previous page'
    );
    expect(labels.at(2).prop('defaultMessage')).toBe(
      page === 2 ? 'First page' : 'Next page'
    );
    buttons.at(0).simulate('click');
    expect(onChange).toHaveBeenLastCalledWith((page + 2) % 3);
    buttons.at(1).simulate('click');
    expect(onChange).toHaveBeenLastCalledWith((page + 1) % 3);
    expect(
      wrapper.find(Scannable).everyWhere((control) => !control.prop('disabled'))
    ).toBe(true);
  }
);
it('disables page controls and scanning when there is only one page', () => {
  const wrapper = shallow(
    <BoardPagination page={0} pageCount={1} onChange={jest.fn()} />
  );
  expect(
    wrapper.find(Button).everyWhere((button) => button.prop('disabled'))
  ).toBe(true);
  expect(
    wrapper.find(Scannable).everyWhere((control) => control.prop('disabled'))
  ).toBe(true);
});
