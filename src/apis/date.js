export default new class date {
    setdate_s(when) {
        var date = new Date();
        var startdate
        if (when == 'yesterday') {
            date.setDate(date.getDate() - 1)
        } else if (when == 'week') {
            date.setDate(date.getDate() - date.getDay());
        } else if (when == 'month') {
            date.setDate(1)
        } else if (when == 'lastweek') {
            date.setDate(date.getDate() - date.getDay() - 7);
        } else if (when == 'lastmonth') {
            date.setMonth(date.getMonth()-1)
            date.setDate(1)
        } else if (when == 'seven') {
            date.setDate(date.getDate() - 6)
        }
        var MM = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        var dd = (date.getDate()) < 10 ? `0${date.getDate()}` : date.getDate()
        startdate = `${date.getFullYear()}-${MM}-${dd}`
        return startdate
    }
    setdate_e(when) {
        var date = new Date();
        var enddate
        if (when == 'yesterday') {
            date.setDate(date.getDate() - 1)
        } else if (when == 'week') {
            date.setDate(date.getDate() - date.getDay() + 6);
        } else if (when == 'month') {
            date.setMonth(date.getMonth()+1)
            date.setDate(1)
            date.setDate(date.getDate()-1)
        } else if (when == 'lastweek') {
            date.setDate(date.getDate() - date.getDay() - 1);
        } else if (when == 'lastmonth') {
            date.setMonth(date.getMonth())
            date.setDate(1)
            date.setDate(date.getDate()-1)
        }
        var MM = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        var dd = (date.getDate()) < 10 ? `0${date.getDate()}` : date.getDate()
        enddate = `${date.getFullYear()}-${MM}-${dd}`
        return enddate
    }
    allday(startd,endd){
        var result = []
        var start = new Date(startd)
        var end = new Date(endd)
        while(end - start >= 0){
            var MM = (start.getMonth() + 1) < 10 ? `0${start.getMonth() + 1}` : start.getMonth() + 1
            var dd = (start.getDate()) < 10 ? `0${start.getDate()}` : start.getDate()
            result.push(`${start.getFullYear()}-${MM}-${dd}`)
            start.setDate(start.getDate() + 1)
        }
        return result
    }
}