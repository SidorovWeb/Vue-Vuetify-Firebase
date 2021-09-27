import moment from 'moment'

export default function formatDate(val) {
  if (!val) {
    return '-'
  }

  let date
  if (val instanceof Date) {
    let a = moment(val)
    date = a.toDate()
  } else {
    date = val.toDate()
  }

  return moment(date).format('DD.MM.YY')
}
