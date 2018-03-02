import { Injectable } from '@angular/core';

@Injectable()
export class FormatService {

    constructor() {}

    public tooltipFormatter(point){
        let value =  (point.toString()).replace(
            /^([-+]?)(0?)(\d+)(.?)(\d+)$/g, function(match, sign, zeros, before, decimal, after) {
                var reverseString = function(string) { return string.split('').reverse().join(''); };
                var insertCommas  = function(string) { 
                    var reversed  = reverseString(string);
                    var reversedWithCommas = reversed.match(/.{1,3}/g).join(',');
                    return reverseString(reversedWithCommas);
                };
                return sign + (decimal ? insertCommas(before) + decimal + after : insertCommas(before + after));
            }
        );

        return value;

    }
}