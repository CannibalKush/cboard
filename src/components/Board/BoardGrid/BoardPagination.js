import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Scannable } from 'react-scannable';

const messages = defineMessages({
  previous: {
    id: 'cboard.components.Board.pagination.previous',
    defaultMessage: 'Previous page'
  },
  next: {
    id: 'cboard.components.Board.pagination.next',
    defaultMessage: 'Next page'
  },
  first: {
    id: 'cboard.components.Board.pagination.first',
    defaultMessage: 'First page'
  },
  last: {
    id: 'cboard.components.Board.pagination.last',
    defaultMessage: 'Last page'
  },
  status: {
    id: 'cboard.components.Board.pagination.status',
    defaultMessage: 'Page {page} of {pages}'
  }
});

export default function BoardPagination({ page, pageCount, onChange }) {
  return (
    <Paper className="BoardPagination" elevation={0} square>
      <Scannable disabled={pageCount <= 1}>
        <Button
          variant="contained"
          color="primary"
          disabled={pageCount <= 1}
          onClick={() => onChange((page - 1 + pageCount) % pageCount)}
        >
          <FormattedMessage
            {...(pageCount > 1 && page === 0
              ? messages.last
              : messages.previous)}
          />
        </Button>
      </Scannable>
      <Typography
        component="span"
        color="textPrimary"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <FormattedMessage
          {...messages.status}
          values={{ page: page + 1, pages: pageCount }}
        />
      </Typography>
      <Scannable disabled={pageCount <= 1}>
        <Button
          variant="contained"
          color="primary"
          disabled={pageCount <= 1}
          onClick={() => onChange((page + 1) % pageCount)}
        >
          <FormattedMessage
            {...(pageCount > 1 && page === pageCount - 1
              ? messages.first
              : messages.next)}
          />
        </Button>
      </Scannable>
    </Paper>
  );
}
BoardPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};
