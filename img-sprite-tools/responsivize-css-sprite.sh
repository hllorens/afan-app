#!/bin/bash

IFS='
';
tech_re="^\(vertical\|horizontal\)-\(background\|imgspacer\)\$";

if [ $# -ne 2 -o `echo $2 | grep -c $tech_re` -le 0 ];then
	echo "ERROR: Two parameters required. CSS-file and Orientation-Technique."; 
	echo -e "\tCSS-file with absolute positions in background-position"; 
	echo -e "\tOrientation-Technique: $tech_re"; 
	exit -1;
fi

numimages=`grep -c "background-position" $1`;
orientation_technique=$2;
orientation=`echo $technique | cut -f 1 -d"-"`;
technique=`echo $technique | cut -f 1 -d"-"`;
numincrements=$((numimages-1));
percentage=`bc <<< "scale=4; 100/$numincrements"`;
count=0;
for line in `cat $1`;do
	if [[ $line =~ .*background-position.* ]];then
		echo "$count>> $line" >&2;
		curr_rel_percentage=`bc <<< "scale=4; $count*$percentage"`;
		if [[ $count -eq 0 ]];then
			echo -e "\tbackground-position: 0% 0%;";
		else
			#echo -e "\tbackground-position: 0% -${count}00%;"; for imgspacer
			echo -e "\tbackground-position: 0% $curr_rel_percentage%;";
		fi
		count=$((count+1));
	else
		echo "$line";
	fi
done
